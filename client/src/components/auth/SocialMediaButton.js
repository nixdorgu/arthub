import React from 'react';
import propTypes from 'prop-types';
import handleSocialLogin from "../../utils/SocialLogin";

function SocialMediaButton({ login, site }) {
    const lowerCasedSite = site.toLowerCase();
    const buttonText = login ? 'Login' : 'Signup';

    if (['facebook', 'google'].includes(lowerCasedSite)) {
        return (
            <button type="button" id={lowerCasedSite} onClick={(e) => handleSocialLogin(e, lowerCasedSite)}>
                <span>
                {buttonText} with <i className={`fa fa-${lowerCasedSite}`} />
                </span>
            </button>
        )
    }

    return <div/>
}

SocialMediaButton.propTypes = {
    login: propTypes.bool.isRequired,
    site: propTypes.string.isRequired
}

export default SocialMediaButton;