export function SocialLogin(site) {
    const redirect = site.toLowerCase() || '';

    const options = {
        'facebook': 'http://localhost:5000/auth/facebook',
        'google': 'http://localhost:5000/auth/google',
    }

    return !options.hasOwnProperty(redirect) ? null : options[redirect];
}

  
export default function handleSocialLogin(e, site) {
    window.location.href = SocialLogin(site);
}