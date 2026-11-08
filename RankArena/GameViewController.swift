import UIKit
import WebKit

/// Rank Arena: свежая игра из GitHub Pages, встроенная игра без интернета.
/// Чтобы менять игровые механики, обновляйте index.html на GitHub Pages.
final class GameViewController: UIViewController, WKNavigationDelegate {
    private var gameView: WKWebView!
    private let onlineURL = URL(string: "https://denisbarabash9-del.github.io/Rank-Arena/index.html")!
    private let trustedHost = "denisbarabash9-del.github.io"
    private var isShowingOfflineGame = false

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.05, green: 0.06, blue: 0.16, alpha: 1)
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.delaysContentTouches = false
        if #available(iOS 16.4, *) {
            webView.isInspectable = false
        }
        gameView = webView
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        loadLatestGame()
    }

    private func loadLatestGame() {
        // Проверяем, опубликована ли игра на GitHub Pages.
        var request = URLRequest(
            url: onlineURL,
            cachePolicy: .reloadIgnoringLocalCacheData,
            timeoutInterval: 10
        )
        request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")

        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                guard let self = self else { return }
                let status = (response as? HTTPURLResponse)?.statusCode
                let looksLikeHTML = data.flatMap {
                    String(data: $0.prefix(4096), encoding: .utf8)
                }?.lowercased().contains("<html") ?? false

                if error == nil && status == 200 && looksLikeHTML {
                    // Каждый запуск загружает актуальную онлайн-версию.
                    self.gameView.load(request)
                } else {
                    self.loadOfflineGame()
                }
            }
        }.resume()
    }

    private func loadOfflineGame() {
        guard !isShowingOfflineGame else { return }
        isShowingOfflineGame = true

        guard let fileURL = Bundle.main.url(
            forResource: "index",
            withExtension: "html",
            subdirectory: "Game"
        ) else {
            gameView.loadHTMLString(
                "<h2 style='color:white;background:#111'>Нет сети и встроенная игра не найдена.</h2>",
                baseURL: nil
            )
            return
        }

        gameView.loadFileURL(
            fileURL,
            allowingReadAccessTo: fileURL.deletingLastPathComponent()
        )
    }

    func webView(_ webView: WKWebView,
                 didFailProvisionalNavigation navigation: WKNavigation!,
                 withError error: Error) {
        loadOfflineGame()
    }

    func webView(_ webView: WKWebView,
                 didFail navigation: WKNavigation!,
                 withError error: Error) {
        loadOfflineGame()
    }

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationResponse: WKNavigationResponse,
                 decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        if navigationResponse.isForMainFrame,
           let http = navigationResponse.response as? HTTPURLResponse,
           http.statusCode >= 400 {
            decisionHandler(.cancel)
            DispatchQueue.main.async { [weak self] in self?.loadOfflineGame() }
            return
        }
        decisionHandler(.allow)
    }

    // Разрешаем только встроенные файлы и страницы своего проекта.
    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url,
              let scheme = url.scheme?.lowercased() else {
            decisionHandler(.cancel)
            return
        }

        if scheme == "file" || scheme == "about" {
            decisionHandler(.allow)
            return
        }

        if scheme == "https",
           url.host?.lowercased() == trustedHost,
           url.path.hasPrefix("/Rank-Arena/") {
            decisionHandler(.allow)
            return
        }

        decisionHandler(.cancel)
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var shouldAutorotate: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
    override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation { .landscapeRight }
}
