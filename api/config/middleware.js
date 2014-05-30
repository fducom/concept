var passport = require('passport')
    , GitHubStrategy = require('passport-github').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , VkontakteStrategy = require('passport-vkontakte').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy;


var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.findOne({uid: profile.id}).exec(function (err, user) {
                if (user) {
                    return done(null, user);
                } else {

                    var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        name: profile.displayName
                    };

                    if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    if(profile.name && profile.name.givenName) {
                        data.fistname = profile.name.givenName;
                    }
                    if(profile.name && profile.name.familyName) {
                        data.lastname = profile.name.familyName;
                    }

                    User.create(data).exec(function (err, user) {
                            return done(err, user);
                        });
                }
            });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).exec(function (err, user) {
        done(err, user) 
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            passport.use(new GitHubStrategy({
                    clientID: '5aa7eed8ad0b5f005f95',
                    clientSecret: '9119b04d48c4f1e1138029f98fe6b886f92b3881',
                    callbackURL: 'http://65ml.com.ua/auth/github/callback'
                }, 
                verifyHandler
            ));
 
            passport.use(new FacebookStrategy({
                    clientID: '522106054560733',
                    clientSecret: 'fbdd75ba706a0ddb70e52d63b52c735e',
                    callbackURL: 'http://65ml.com.ua/auth/facebook/callback'
                },
                verifyHandler
            ));

            passport.use(new GoogleStrategy({
                    clientID: '875911831771',
                    clientSecret: 'nsrymAe5peKVlTXA30lKh9xE',
                    callbackURL: 'http://65ml.com.ua/auth/google/callback'
                },
                verifyHandler
            )); 

            passport.use(new VkontakteStrategy({
                    clientID: '4372402',
                    clientSecret: 'UIKuqiAuHlTomAGTb3BL',
                    callbackURL: 'http://65ml.com.ua/auth/vkontakte/callback'
                },
                verifyHandler
            )); 
	   /* passport.use(new TwitterStrategy({
                    //clientID: 'JRovNkxyTOZvVcKJlbaOmtoxf',
                   // clientSecret: 'tHN1Xkl4plw8Kfys7dlAbMpaI0K9S7BEFdLdjNWxjsNMYVoDbE',
                    callbackURL: 'http://65ml.com.ua/auth/twitter/callback'
                },
                verifyHandler
            )); 
*/

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};
