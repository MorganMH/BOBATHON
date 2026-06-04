import axios from 'axios';

// Same-origin JSON client for the AI + voice endpoints, with Laravel's CSRF token
// taken from the <meta name="csrf-token"> tag in app.blade.php.
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

const api = axios.create({
    headers: {
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
});

export default api;
