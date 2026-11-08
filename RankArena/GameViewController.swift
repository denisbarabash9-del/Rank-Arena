import UIKit
import WebKit

/// Нативная iOS-оболочка для автономной Rank Arena v2.
/// Игра входит в комплект приложения, подключение к интернету не требуется.
final class GameViewController: UIViewController, WKNavigationDelegate {
    private var gameView: WKWebView!

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.05, green: 0.06, blue: 0.16, alpha: 1.0)
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.delaysContentTouches = false
        if #available(iOS 16.4, *) {
            webView.isInspectable = false
        }
        self.gameView = webView
        self.view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        guard let gameURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Game") else {
            gameView.loadHTMLString("<h1>Ошибка: игра не включена в приложение.</h1>", baseURL: nil)
            return
        }
        // Доступ только к папке встроенной игры; внешние сайты не используются.
        gameView.loadFileURL(gameURL, allowingReadAccessTo: gameURL.deletingLastPathComponent())
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var shouldAutorotate: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
    override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation { .landscapeRight }

    // Не допускаем случайных переходов на внешние сайты из игры.
    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        let scheme = navigationAction.request.url?.scheme?.lowercased()
        decisionHandler(scheme == "file" || scheme == "about" ? .allow : .cancel)
    }
}
