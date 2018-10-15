import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {defineMessages} from 'react-intl';
import DeckList from './DeckList';
import Carousel from './Carousel';
import {NavLink, navigateAction} from 'fluxible-router';
import SearchBox from '../Search/AutocompleteComponents/HeaderSearchBox';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import {Button} from 'semantic-ui-react';
import updateTrap from '../../actions/loginModal/updateTrap';
import UserProfileStore from '../../stores/UserProfileStore';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.messages = defineMessages({
            welcome: {
                id: 'home.welcome',
                defaultMessage: 'Welcome to SlideWiki'
            },
            signUp: {
                id: 'home.signUp',
                defaultMessage: 'Sign Up'
            },
            learnMore: {
                id: 'home.learnMore',
                defaultMessage: 'Learn More'
            },
            findSlides: {
                id: 'home.findSlides',
                defaultMessage: 'Find slides'
            },
            findSlidesSubtitle: {
                id: 'home.findSlidesSubtitle',
                defaultMessage: 'Explore the deck lorem ipsum'           // TODO: change lorem ipsums
            },
            findSlidesContent: {
                id: 'home.findSlidesContent',
                defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet aliquam n ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet.'           // TODO: change lorem ipsums
            },
            createSlides: {
                id: 'home.createSlides',
                defaultMessage: 'Create slides'
            },
            createSlidesSubtitle: {
                id: 'home.createSlidesSubtitle',
                defaultMessage: 'Learn how to create slides with SlideWiki'
            },
            createSlidesContent: {
                id: 'home.createSlidesContent',
                defaultMessage: 'Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.'
            },
            sharingSlides: {
                id: 'home.sharingSlides',
                defaultMessage: 'Sharing slides'
            },
            sharingSlidesSubtitle: {
                id: 'home.sharingSlidesSubtitle',
                defaultMessage: 'Present, Share and Communicate'
            },
            sharingSlidesContent: {
                id: 'home.sharingSlidesContent',
                defaultMessage: 'There are many ways that you and your students can engage and interact with slides and decks. Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes\' view. Share decks via social media or email.'
            },
            getStarted: {
                id: 'home.getStarted',
                defaultMessage: 'Get started right away.'
            },
            signIn: {
                id: 'home.signIn',
                defaultMessage: 'Sign in'
            },
            getStartedDescription: {
                id: 'home.getStartedDescription',
                defaultMessage: 'Create an account to start creating and sharing your decks. '
            },
            decks: {
                id: 'home.decks',
                defaultMessage: 'Open educational resources for all learning environments'
            },
            schools: {
                id: 'home.schools',
                defaultMessage: 'Schools'
            },
            schoolsContent: {
                id: 'home.schoolsContent',
                defaultMessage: 'Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.' // TODO: remove lorem ipsums
            },
            colleges: {
                id: 'home.colleges',
                defaultMessage: 'Colleges'
            },
            collegesContent: {
                id: 'home.collegesContent',
                defaultMessage: 'Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.' // TODO: remove lorem ipsums
            },
            training: {
                id: 'home.training',
                defaultMessage: 'Training'
            },
            trainingContent: {
                id: 'home.trainingContent',
                defaultMessage: 'Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.' // TODO: remove lorem ipsums
            },
            slideWikiEnjoy: {
                id: 'home.slideWikiEnjoy',
                defaultMessage: 'SlideWiki: Create, Share and Enjoy Presentations'
            },
            slideWikiAbout: {
                id: 'home.slideWikiAbout',
                defaultMessage: 'The SlideWiki Project'
            },
            slideWikiAboutContent: {
                id: 'home.slideWikiAboutContent',
                defaultMessage: 'SlideWiki is an online slideshow tool that offers users the chance to create and collaborate on slides, assessments and to share content as structured open educational resources using a Creative Commons licence. With SlideWiki you can engage with your audience by collaborating with colleagues to co-design and co-create course materials and share your knowledge across the world. SlideWiki is an open-source platform, and all its content can be reused under Creative Commons CC-BY-SA license. SlideWiki development, large-scale trials and underlying research is funded from Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095. The project involves 17 partners to develop, test and trial SlideWiki. '
            },
            slideWikiAboutVisit: {
                id: 'home.slideWikiAboutVisit',
                defaultMessage: 'visit the project website.'
            },
            myDecks: {
                id: 'home.myDecks',
                defaultMessage: 'My Decks.'
            }
        });
    }

    openFeatured(e){
        this.context.executeAction(navigateAction, {
            url: '/featured'
        });
    };

    handleSignUpButton() {
        this.context.executeAction(navigateAction, {
            url: '/signup'
        });
    }

    handleLoginButton() {
        this.context.executeAction(updateTrap,{activeTrap:true});
        //hidden the other page elements to readers
        $('#app').attr('aria-hidden','true');
        $('.ui.login.modal').modal('toggle');

        this.closeSidebar({target: '<a className="item"></a>'});
    }

    scrollToLearnMore() {
        let pos = $('#learnMore').position();
        if (window.innerWidth > 1200) {
            pos.top = pos.top - 346;
        } else if (window.innerWidth > 990) {
            pos.top = pos.top -300;
        }
        window.scroll(pos);
        $('#learnMore').focus();
    }


    render() {
        let signInStyle = {cursor: 'pointer'};
        let signInOrMyDecksElement = this.props.UserProfileStore.username === '' ?
            <a onClick={this.handleLoginButton.bind(this)} style={signInStyle} >{this.context.intl.formatMessage(this.messages.signIn)}</a> :
            <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username}>
                {this.context.intl.formatMessage(this.messages.myDecks)}
            </NavLink>;
        return (
            <div ref='home'>
                {/*<!-- presentation starts -->*/}
                <div className='sr-only' role='main'>
                    <h1>{this.context.intl.formatMessage(this.messages.welcome)}</h1>
                </div>
                <section className='banner-container'>
                    <img src='/assets/images/home/banner.jpg' alt=''/>
                        <div className='banner-content' style={{zIndex: 0}}>
                            <div className='ui container'>
                                <div className='ui  column  grid'>
                                    <div className='column '>
                                        <SearchBox type='home'/>
                                        <div className='button-blk'>
                                            <button className='home primary button' onClick={this.handleSignUpButton.bind(this)}>
                                                {this.context.intl.formatMessage(this.messages.signUp)}
                                            </button>
                                            <button className='home secondary  button' onClick={this.scrollToLearnMore.bind(this)}>
                                                {this.context.intl.formatMessage(this.messages.learnMore)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>

                {/*<!-- presentation End -->*/}

                <section className='content-container'>
                    <div id="learnMore" className='sr-only'>
                        <h2>Learn more about SlideWiki</h2>
                    </div>
                    <div className='feature-block'>
                        <div className='wrapper'>
                            <div className='ui three column  stackable  grid'>
                                <div className='row'>
                                    <div className='column'>
                                        <div className='feature-content blue-block'>
                                            <div className='feature-left'>
                                                <h3 className='ui header blue large'>{this.context.intl.formatMessage(this.messages.findSlides)}</h3>
                                                <h4 className='ui header blue medium'>{this.context.intl.formatMessage(this.messages.findSlidesSubtitle)}</h4>
                                                <p>{this.context.intl.formatMessage(this.messages.findSlidesContent)}</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/search.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='feature-content green-block'>
                                            <div className='feature-left'>
                                                <h3 className='ui header teal large'>{this.context.intl.formatMessage(this.messages.createSlides)}Create slides</h3>
                                                <h4 className='ui header teal medium'>{this.context.intl.formatMessage(this.messages.findSlidesSubtitle)}</h4>
                                                <p>{this.context.intl.formatMessage(this.messages.findSlidesContent)}</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/add.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='feature-content red-block'>
                                            <div className='feature-left'>
                                                <h3 className='ui header large pink'>{this.context.intl.formatMessage(this.messages.sharingSlides)}</h3>
                                                <h4 className='ui header medium pink'>{this.context.intl.formatMessage(this.messages.sharingSlidesSubtitle)}</h4>
                                                <p>{this.context.intl.formatMessage(this.messages.sharingSlidesContent)}</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/share.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='signin-outer'>
                        <div className='wrapper'>
                            <div className='signin-blk'>
                                <span>{this.context.intl.formatMessage(this.messages.getStarted)}{' '}
                                    {signInOrMyDecksElement}
                                </span>
                                <p>{this.context.intl.formatMessage(this.messages.getStartedDescription)}</p>
                            </div>
                        </div>
                    </div>

                   {/* <!-- category starts -->*/}
                    <div className='category-outer'>
                        <div className='ui container'>
                            <div className='ui column '>
                                <div className='row'>
                                    <div className='column'>
                                        <h3 className='ui header large'>{this.context.intl.formatMessage(this.messages.decks)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='category-list'>
                                <div className='ui three column  stackable grid'>
                                    <div className='row'>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img1.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>{this.context.intl.formatMessage(this.messages.schools)}</a>
                                                        <p>{this.context.intl.formatMessage(this.messages.schoolsContent)}</p>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img2.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>{this.context.intl.formatMessage(this.messages.colleges)}</a>
                                                        <p>{this.context.intl.formatMessage(this.messages.collegesContent)}</p>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img3.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>{this.context.intl.formatMessage(this.messages.training)}</a>
                                                        <p>{this.context.intl.formatMessage(this.messages.trainingContent)}</p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<!-- category End -->*/}

                    {/*<!-- presentation Start -->*/}

                    <div className='presentation-block'>
                        <div className='ui container'>
                            <div className='ui one column grid'>
                                <div className='column'>
                                    <h2>{this.context.intl.formatMessage(this.messages.slideWikiEnjoy)}</h2>
                                    <div className='column'>
                                        <div className='about-block'>
                                            {/* <h3>{this.context.intl.formatMessage(this.messages.slideWikiAbout)}</h3> */}
                                            <p>{this.context.intl.formatMessage(this.messages.slideWikiAboutContent)} <a href='https://slidewiki.eu/' target='_blank'>{this.context.intl.formatMessage(this.messages.slideWikiAboutVisit)}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<!-- presentation End -->*/}
                </section>


                {/*<!-- content ends -->*/}

            </div>
        );
    }
}

Home.contextTypes = {
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
};

Home = connectToStores(Home, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default Home;



//export default Home;
