import React from 'react';
import {getLanguageName, getLanguageNativeName} from '../../common';
import { writeCookie } from '../../common';
import IntlStore from '../../stores/IntlStore';
import { locales, flagForLocale } from '../../configs/locales';
import { connectToStores } from 'fluxible-addons-react';
import { Dropdown, Menu } from 'semantic-ui-react';

class LocaleSwitcher extends React.Component {
    //HACK This component is reused but also reimplemented in User/UserProfile/ChangePersonalData.js for better integration reasons.
    constructor(props){
        super(props);
        this.state = {
            currentLocale: this.props.IntlStore.currentLocale,
            locales: this.props.IntlStore.locales
        };
    }

    handleLocaleClick(locale, e) {
        e.preventDefault();
        writeCookie('locale', locale, 365);
        this.setState({currentLocale: locale});
        window.location.reload();
    }

    handleLocaleChange(e, localeDropdown) {
        writeCookie('locale', localeDropdown.value, 365);
        this.setState({currentLocale: localeDropdown.value});
        window.location.reload();
    }

    getLocaleOptions() {
        return locales.map((locale) => {
            let flag = flagForLocale(locale) || 'icon';
            let options = {
                key: locale,
                text: <span><i className={`flag ${flag}`} />{getLanguageName(locale)}</span>,
                value: locale
            };
            return options;
        });
    }

    renderLocaleLink(locale) {
        let flag = flagForLocale(locale);
        let className = (locale === this.state.currentLocale) ? 'active' : '';
        switch (this.props.mode) {
            case 'sidebar':
                return(
                    <a
                        href='#'
                        key={locale}
                        onClick={this.handleLocaleClick.bind(this, locale)}
                        href={`?locale=${locale}`} className="item">
                            {flag ? <i className={`flag ${flag}`} /> : <span><i className='flag icon' /></span>}
                            {getLanguageName(locale)}
                    </a>
                );
                break;
            default:
                return (
                    <Dropdown.Item key={locale} onClick={this.handleLocaleClick.bind(this, locale)} href={`?locale=${locale}`} className={className}>
                      <i className={`flag ${flag || 'icon'}`}/>
                      {getLanguageName(locale)}
                    </Dropdown.Item>
                );
        }
    }

    render() {
        let currentFlag = flagForLocale(this.state.currentLocale);
        let current_header = <i className={currentFlag ? `flag ${currentFlag}` : 'icon flag'}/>;
        switch (this.props.mode) {
            case 'icon':
                return (
                    <Dropdown trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
                break;
            case 'headeronly':
                return(
                    <div>
                      <span>{getLanguageName(this.state.currentLocale)}  </span>
                      {current_header}
                    </div>);
                break;
            case 'sidebar':
                return (
                      <div>
                      { locales.map(this.renderLocaleLink, this) }
                      </div>
                );
                break;
            default:
                current_header = <span>{current_header}{getLanguageName(this.state.currentLocale)}</span>;
                return (<div>
                    <Dropdown item trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                        item
                        selectOnNavigation={false}
                        value={this.state.currentLocale}
                        options={ this.getLocaleOptions() }
                        onChange={this.handleLocaleChange.bind(this)}
                    />
                </div>);
        }
    }
}

LocaleSwitcher = connectToStores(LocaleSwitcher, [IntlStore], (context, props) => {
    return {
        IntlStore: context.getStore(IntlStore).getState()
    };
});

export default LocaleSwitcher;
