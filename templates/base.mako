<%namespace name="galaxy_client" file="/galaxy_client_app.mako" />
<% self.js_app = None %>

<% _=n_ %>
<!DOCTYPE HTML>
<html>
    <!--base.mako-->
    ${self.init()}
    <head>
        <title>${self.title()}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        ## relative href for site root
        <link rel="index" href="${ h.url_for( '/' ) }"/>
        ${self.metas()}
        ${self.stylesheets()}
        ${self.javascripts()}
        ${self.javascript_app()}
    </head>
    <body class="inbound">
        ${next.body()}
    </body>
</html>

## Default title
<%def name="title()"></%def>

## Default init
<%def name="init()"></%def>

## Default stylesheets
<%def name="stylesheets()">
    ${h.css('base')}
</%def>

## Default javascripts
<%def name="javascripts()">
    ## Send errors to Sntry server if configured
    %if app.config.sentry_dsn:
        ${h.js( "libs/tracekit", "libs/raven" )}
        <script>
            Raven.config('${app.config.sentry_dsn_public}').install();
            %if trans.user:
                Raven.setUser( { email: "${trans.user.email|h}" } );
            %endif
        </script>
    %endif

    ${h.js(
        ## TODO: remove when all libs are required directly in modules
        'bundled/libs.bundled',
        'libs/require',
    )}

    <script type="text/javascript">
        ## global configuration object
        ## TODO: remove
        window.Galaxy = window.Galaxy || {};
        window.Galaxy.root = '${h.url_for( "/" )}';
        window.Galaxy.config = {};

        // configure require
        // due to our using both script tags and require, we need to access the same jq in both for plugin retention
        // source http://www.manuel-strehl.de/dev/load_jquery_before_requirejs.en.html
        define( 'jquery', [], function(){ return jQuery; })
        // TODO: use one system

        // shims and paths
        require.config({
            baseUrl: "${h.url_for('/static/scripts') }",
            shim: {
                "libs/underscore": {
                    exports: "_"
                },
                "libs/backbone": {
                    deps: [ 'jquery', 'libs/underscore' ],
                    exports: "Backbone"
                }
            },
            // cache busting using time server was restarted
            urlArgs: 'v=${app.server_starttime}'
        });
    </script>

    %if not form_input_auto_focus is UNDEFINED and form_input_auto_focus:
        <script type="text/javascript">
            $(document).ready( function() {
                // Auto Focus on first item on form
                if ( $("*:focus").html() == null ) {
                    $(":input:not([type=hidden]):visible:enabled:first").focus();
                }
            });
        </script>
    %endif

</%def>

<%def name="javascript_app()">
    ${ galaxy_client.load( app=self.js_app ) }
</%def>

## Additional metas can be defined by templates inheriting from this one.
<%def name="metas()"></%def>
