// --- JS Lesson: Supabase Client ---
// The code below creates a Supabase client instance.
// This client will be our main way of interacting with Supabase services.
// You need to replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY'
// with the actual values you got when you ran `supabase start`.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- JS Lesson: DOMContentLoaded ---
// This event listener waits for the HTML document to be completely loaded and parsed
// before running our JavaScript code. This is important because we need to make sure
// the HTML elements (like forms and buttons) exist before we try to add event listeners to them.
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutButton = document.getElementById('logout-button');

    // --- JS Lesson: Event Listeners ---
    // We use `addEventListener` to listen for specific events on HTML elements.
    // When the event occurs (like a form submission or a button click),
    // the provided function (the "event handler") is executed.

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevents the form from submitting the traditional way (reloading the page)
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            // --- JS Lesson: async/await ---
            // `async` and `await` are used to work with asynchronous operations,
            // like making a request to a server. `async` on a function allows it
            // to use `await`. `await` pauses the function execution until the
            // asynchronous operation (the Promise) is resolved. This makes
            // asynchronous code look and behave more like synchronous code,
            // which is easier to read and reason about.

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    }
                }
            });

            if (error) {
                alert('Error signing up: ' + error.message);
            } else {
                alert('Sign up successful! Please check your email to verify your account.');
                // Redirect to login page after successful signup
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Error logging in: ' + error.message);
            } else {
                // Redirect to the home page after successful login
                window.location.href = 'index.html';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert('Error logging out: ' + error.message);
            } else {
                // Redirect to the login page after successful logout
                window.location.href = 'login.html';
            }
        });
    }

    // --- JS Lesson: Checking Authentication State ---
    // This code checks if the user is already logged in when the page loads.
    // If the user is not logged in and they are not on the login or signup page,
    // we redirect them to the login page. This protects our `index.html` page.
    const protectPage = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

        if (!user && !isAuthPage) {
            window.location.href = 'login.html';
        } else if (user && isAuthPage) {
            window.location.href = 'index.html';
        }
    };

    protectPage();
});
