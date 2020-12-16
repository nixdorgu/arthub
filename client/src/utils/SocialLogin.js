export default function SocialLogin(site) {
    const redirect = site.toLowerCase() || '';

    const options = {
        'facebook': 'http://localhost:5000/auth/facebook',
        'google': 'http://localhost:5000/auth/google',
    }

    return !options.hasOwnProperty(redirect) ? null : options[redirect];
}
