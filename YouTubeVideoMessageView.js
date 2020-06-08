/**
 * A view that presents a single video message, then prompts the user to continue.
 * @class
 * @extends StackView
 * @param {YouTubeVideoMessageView~Options} options - An object of keyed options for initializing the view.
 */
var YouTubeVideoMessageView = function (options) {
    StackView.call(this, options)
}
extend(StackView, YouTubeVideoMessageView)

/**
 * @typedef {Object} YouTubeVideoMessageView~Options
 * @property {string} options.videoURL - The URL of the video to play.
 * @property {boolean} [options.canSkip=false] - If true, the user can continue before the video finishes.
 * @property {string} [options.title="Welcome"] - The title for the video message.
 * @property {string} [options.continuePrompt="Continue"] - The prompt to display to the user when the video ends.
 * @property {StackView} [options.nextView=false] - The view to push when the user chooses to continue. If false, the view pops on continue.
 */
/**
 * @property {YouTubeVideoMessageView~Options} options - An object of keyed options for the view.
 */
YouTubeVideoMessageView.prototype.options = {
    videoURL: undefined,
    canSkip: false,
    title: 'Welcome',
    continuePrompt: 'Continue',
    nextView: false,
    autoplay: false,
    transition: undefined,
    controls: false,
}

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
YouTubeVideoMessageView.prototype.HTMLSource = '<?php StackViewSource() ?>'

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
YouTubeVideoMessageView.prototype.styles =
    "<?php FileContents(__DIR__ . '/styles.css') ?>"

/**
 * This function is called when the view is first shown.
 * @override
 */
YouTubeVideoMessageView.prototype.onAddToApplication = function () {
    // hack bc this screen isnt destroyed going into next
    // dynamically creates a new div for youtube to swap with an iframe
    let sel = $('.intro-video')
    const id = 'player-' + sel.length
    sel.last().append(`<div id="${id}" class="video-element"></div>`)

    let player = new YT.Player(id, {
        height: '360',
        width: '640',
        videoId: this.options.videoURL,
        playerVars: { modestbranding: 1, controls: 0, disablekb: 1 },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    })

    function onPlayerReady(e) {
        player.playVideo()
    }

    function onPlayerStateChange(e) {
        if (e.data === YT.PlayerState.PAUSED) player.playVideo()
        if (e.data === YT.PlayerState.ENDED) {
            this.options.canSkip = true
            $(nextButton).prop('disabled', false)
        }
    }

    let scope = this
    let nextButton = $(this.DOMObject).find('.continue')
    //check if intro video file exists, if not show error message
    $('.video-prompt').hide()
    // if (this.options.controls) enableVideoControls()
    // if (this.options.autoplay) $(videoElement).prop('autoplay', 'autoplay')
    // if (!this.options.canSkip) $(nextButton).prop('disabled', true)

    this.DOMObject.find('.video-message-title').text(scope.options.title)

    nextButton.attr('value', this.options.continuePrompt).click(function () {
        if (scope.options.canSkip) {
            $('.video-prompt').hide()
            player.stopVideo()
            if (scope.options.nextView) {
                scope.application.push(scope.options.nextView, {
                    transition: scope.options.transition,
                })
            } else {
                scope.application.pop()
            }
        }
    })
}
