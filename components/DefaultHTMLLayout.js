import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class DefaultHTMLLayout extends React.Component {
    render() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/custom_modules/custom-semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />
                <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
                <link href="/bower_components/sweetalert2/dist/sweetalert2.min.css" rel="stylesheet" type="text/css" />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                {/* Following are added only to support IE browser */}
                <script src="/bower_components/es5-shim/es5-shim.min.js"></script>
                <script src="/bower_components/es5-shim/es5-sham.min.js"></script>
                <script src="/bower_components/json3/lib/json3.min.js"></script>
                <script src="/bower_components/es6-shim/es6-shim.min.js"></script>
                <script src="/bower_components/es6-shim/es6-sham.min.js"></script>
                {/* Above are added only to support IE browser */}
                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src="/bower_components/jquery/dist/jquery.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/progress.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/accordion.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/transition.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/popup.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dropdown.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/checkbox.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dimmer.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/modal.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/form.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/tab.min.js"></script>
                {/* All external vendors bundle*/}
                <script src="/public/js/vendor.bundle.js"></script>
                <script src="/custom_modules/ckeditor/ckeditor.js"></script>
                <script src="/custom_modules/simple-draggable/lib/index.js"></script>
                <script type="javascript">
                    //CKEDITOR.disableAutoInline = false; //need to disable auto-initate to config inline toolbars
                    CKEDITOR.disableAutoInline = true; //need to disable auto-initate to config inline toolbars
                </script>
                <script src="/bower_components/headjs/dist/1.0.0/head.min.js"></script>
                {/* Adding for dependency loading with reveal.js*/}
                <script src="/bower_components/reveal.js/js/reveal.js"></script>
                {/* Main app bundle */}
                <script src={'/public/js/' + this.props.clientFile}></script>
                <script type="text/javascript" src="https://slidewiki.atlassian.net/s/5e2fc7b2a8ba40bc00a09a4f81a301c8-T/rfg5q6/100012/c/1000.0.9/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=241c9e18"></script>
                <script src="/bower_components/sweetalert2/dist/sweetalert2.min.js"></script>
            </body>
            </html>
        );
    }
}

export default DefaultHTMLLayout;
