// Auth gate
(function() {
    const SESSION_KEY = 'greenbook_auth';
    // Base64 encoded password (not plaintext, but not truly secure)
    const VALID = atob('bW9uZXkxMjM='); // money123

    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        unlock();
        return;
    }

    document.getElementById('auth-btn').addEventListener('click', tryAuth);
    document.getElementById('auth-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') tryAuth();
    });

    function tryAuth() {
        var input = document.getElementById('auth-input').value.trim();
        if (input === VALID) {
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
