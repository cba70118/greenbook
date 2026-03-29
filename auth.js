// Simple client-side auth gate
// Not cryptographically secure — prevents casual access, not determined attackers
// For true security, use server-side auth (Cloudflare Access, Netlify Identity, etc.)

(function() {
    const SESSION_KEY = 'greenbook_auth';
    const VALID_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a694'; // sha256 of the password

    async function sha256(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Check if already authenticated this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        unlock();
        return;
    }

    document.getElementById('auth-btn').addEventListener('click', tryAuth);
    document.getElementById('auth-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') tryAuth();
    });

    async function tryAuth() {
        const input = document.getElementById('auth-input').value.trim();
        const hash = await sha256(input);
        if (hash === VALID_HASH) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            unlock();
        } else {
            document.getElementById('auth-error').textContent = 'Invalid access code';
            document.getElementById('auth-input').value = '';
        }
    }

    function unlock() {
        document.getElementById('auth-gate').classList.add('hidden');
        document.getElementById('app-content').style.display = '';
    }
})();
