import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../env.js';
import { SRA_LEVELS, SRA_SKILLS, BOOK_UNITS, QUESTIONS_PER_UNIT } from './constants.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Application State
let currentUser = null;
let currentChild = null;
let currentBook = null;
let currentUnit = 1;
let currentQuestions = [];
let userAnswers = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check authentication and route accordingly
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
        return;
    } else if (user && isAuthPage) {
        window.location.href = 'index.html';
        return;
    }

    if (user) {
        currentUser = user;
        setupMainApp();
    } else {
        setupAuthForms();
    }
}

function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

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
                showError('Error signing up: ' + error.message);
            } else {
                showSuccess('Sign up successful! Please check your email to verify your account.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
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
                showError('Error logging in: ' + error.message);
            } else {
                window.location.href = 'index.html';
            }
        });
    }
}

function setupMainApp() {
    // Display user email
    const userEmailElement = document.getElementById('user-email');
    if (userEmailElement) {
        userEmailElement.textContent = currentUser.email;
    }

    // Setup event listeners
    setupEventListeners();
    
    // Setup level options in modal
    setupLevelOptions();
    
    // Load and display children
    loadChildren();
    
    // Show parent dashboard by default
    showView('parent-dashboard');
}

function setupEventListeners() {
    // Logout
    document.getElementById('logout-button')?.addEventListener('click', handleLogout);
    
    // Add child
    document.getElementById('add-child-btn')?.addEventListener('click', () => openChildModal());
    
    // Child form
    document.getElementById('child-form')?.addEventListener('submit', handleChildSubmit);
    document.getElementById('cancel-child')?.addEventListener('click', closeChildModal);
    
    // Navigation
    document.getElementById('back-to-parent')?.addEventListener('click', () => showView('parent-dashboard'));
    document.getElementById('back-to-books')?.addEventListener('click', () => showView('child-dashboard'));
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        showError('Error logging out: ' + error.message);
    } else {
        window.location.href = 'login.html';
    }
}

function setupLevelOptions() {
    const levelSelect = document.getElementById('child-level');
    if (levelSelect) {
        levelSelect.innerHTML = '';
        SRA_LEVELS.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            levelSelect.appendChild(option);
        });
    }
}

async function loadChildren() {
    try {
        const { data: children, error } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', currentUser.id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        displayChildren(children || []);
    } catch (error) {
        console.error('Error loading children:', error);
        showError('Failed to load children profiles');
    }
}

function displayChildren(children) {
    const childrenList = document.getElementById('children-list');
    if (!childrenList) return;

    childrenList.innerHTML = '';

    children.forEach(child => {
        const childCard = createChildCard(child);
        childrenList.appendChild(childCard);
    });
}

function createChildCard(child) {
    const card = document.createElement('div');
    card.className = 'child-card';
    card.onclick = () => openChildDashboard(child);

    const progress = calculateProgress(child);

    card.innerHTML = `
        <div class="child-card-header">
            <div class="child-avatar ${child.avatar_color}">
                ${child.name.charAt(0).toUpperCase()}
            </div>
            <div class="child-info">
                <h3>${child.name}</h3>
                <div class="child-level">${child.current_level}</div>
            </div>
        </div>
        <div class="child-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <div class="progress-text">${progress.text}</div>
        </div>
    `;

    return card;
}

function calculateProgress(child) {
    // Simple progress calculation - can be enhanced with actual progress data
    const levelIndex = SRA_LEVELS.indexOf(child.current_level);
    const totalLevels = SRA_LEVELS.length;
    const booksPerLevel = SRA_SKILLS.length;
    
    // Mock progress for now - would come from database
    const completedBooks = Math.floor(Math.random() * booksPerLevel);
    const percentage = ((levelIndex * booksPerLevel + completedBooks) / (totalLevels * booksPerLevel)) * 100;
    
    return {
        percentage: Math.round(percentage),
        text: `${completedBooks}/${booksPerLevel} books completed in ${child.current_level}`
    };
}

function openChildModal(child = null) {
    const modal = document.getElementById('child-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('child-form');

    if (child) {
        modalTitle.textContent = 'Edit Child';
        document.getElementById('child-name').value = child.name;
        document.getElementById('child-level').value = child.current_level;
        document.getElementById('child-avatar').value = child.avatar_color;
        form.dataset.childId = child.id;
    } else {
        modalTitle.textContent = 'Add Child';
        form.reset();
        delete form.dataset.childId;
    }

    modal.classList.remove('hidden');
}

function closeChildModal() {
    document.getElementById('child-modal').classList.add('hidden');
}

async function handleChildSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const childData = {
        name: formData.get('name'),
        current_level: formData.get('level'),
        avatar_color: formData.get('avatar'),
        parent_id: currentUser.id
    };

    const isEdit = event.target.dataset.childId;

    try {
        let result;
        if (isEdit) {
            result = await supabase
                .from('children')
                .update(childData)
                .eq('id', event.target.dataset.childId);
        } else {
            result = await supabase
                .from('children')
                .insert([childData]);
        }

        if (result.error) throw result.error;

        closeChildModal();
        loadChildren();
        showSuccess(isEdit ? 'Child updated successfully!' : 'Child added successfully!');
    } catch (error) {
        console.error('Error saving child:', error);
        showError('Failed to save child profile');
    }
}

function openChildDashboard(child) {
    currentChild = child;
    
    // Update child display
    document.getElementById('child-name-display').textContent = child.name;
    document.getElementById('child-level-display').textContent = child.current_level;
    
    const avatarDisplay = document.getElementById('child-avatar-display');
    avatarDisplay.className = `child-avatar ${child.avatar_color}`;
    avatarDisplay.textContent = child.name.charAt(0).toUpperCase();
    
    // Load books for this level
    loadBooksForLevel(child.current_level);
    
    showView('child-dashboard');
}

async function loadBooksForLevel(level) {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = '';

    // Create book cards for each skill
    for (const skill of SRA_SKILLS) {
        const bookCard = await createBookCard(level, skill);
        booksGrid.appendChild(bookCard);
    }
}

async function createBookCard(level, skill) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    // Get progress for this book (mock for now)
    const progress = await getBookProgress(currentChild.id, level, skill);
    
    if (progress.completed) {
        card.classList.add('completed');
    } else if (progress.started) {
        card.classList.add('in-progress');
    }

    card.innerHTML = `
        <h4>${skill}</h4>
        <p>${level}</p>
        <div class="book-status ${progress.status}">${progress.statusText}</div>
    `;

    card.onclick = () => openBook(level, skill);

    return card;
}

async function getBookProgress(childId, level, skill) {
    // Mock progress data - would come from database
    const random = Math.random();
    if (random > 0.7) {
        return { completed: true, started: true, status: 'completed', statusText: 'Completed!' };
    } else if (random > 0.4) {
        return { completed: false, started: true, status: 'in-progress', statusText: 'In Progress' };
    } else {
        return { completed: false, started: false, status: 'not-started', statusText: 'Not Started' };
    }
}

function openBook(level, skill) {
    currentBook = { level, skill };
    currentUnit = 1;
    
    document.getElementById('current-book-title').textContent = `${level} - ${skill}`;
    
    loadUnit();
    showView('book-interface');
}

async function loadUnit() {
    const unitCount = BOOK_UNITS[currentBook.level] || 25;
    const questionsPerUnit = QUESTIONS_PER_UNIT[currentBook.level] || 10;
    
    // Update progress
    updateBookProgress(currentUnit, unitCount);
    
    // Generate mock questions for this unit
    currentQuestions = generateMockQuestions(questionsPerUnit, currentUnit);
    userAnswers = {};
    
    renderQuestions();
}

function updateBookProgress(current, total) {
    const progressBar = document.getElementById('book-progress');
    const progressText = document.getElementById('progress-text');
    
    const percentage = (current / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `Unit ${current} of ${total}`;
}

function generateMockQuestions(count, unitNumber) {
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
        questions.push({
            id: `unit_${unitNumber}_q_${i}`,
            number: i,
            text: `This is question ${i} for unit ${unitNumber}. ${generateMockQuestionText()}`,
            options: [
                { id: 'a', text: 'Option A - First possible answer' },
                { id: 'b', text: 'Option B - Second possible answer' },
                { id: 'c', text: 'Option C - Third possible answer' },
                { id: 'd', text: 'Option D - Fourth possible answer' }
            ],
            correct: ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
        });
    }
    
    return questions;
}

function generateMockQuestionText() {
    const questionTypes = [
        "Read the passage and choose the best answer.",
        "What is the main idea of this sentence?",
        "Which word best completes the sentence?",
        "What does the underlined word mean?",
        "What happened first in the story?",
        "What can you conclude from this information?",
        "Follow the directions and choose the correct answer.",
        "Where would you look to find this information?",
        "What is the most important fact in this paragraph?"
    ];
    
    return questionTypes[Math.floor(Math.random() * questionTypes.length)];
}

function renderQuestions() {
    const container = document.getElementById('question-container');
    if (!container) return;

    container.innerHTML = `
        <div class="unit-header">
            <h2 class="unit-title">Unit ${currentUnit}</h2>
            <p class="unit-description">${currentBook.skill} - ${currentBook.level}</p>
        </div>
    `;

    currentQuestions.forEach((question, index) => {
        const questionCard = createQuestionCard(question, index);
        container.appendChild(questionCard);
    });

    // Add submit button
    const submitSection = document.createElement('div');
    submitSection.className = 'question-actions';
    submitSection.innerHTML = `
        <button id="submit-unit" class="btn btn-primary">Submit Unit</button>
    `;
    container.appendChild(submitSection);

    document.getElementById('submit-unit').addEventListener('click', submitUnit);
}

function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';

    card.innerHTML = `
        <div class="question-number">Question ${question.number}</div>
        <div class="question-text">${question.text}</div>
        <div class="answer-options">
            ${question.options.map(option => `
                <label class="answer-option">
                    <input type="radio" name="question_${question.id}" value="${option.id}">
                    <span class="answer-text">${option.text}</span>
                </label>
            `).join('')}
        </div>
    `;

    // Add click handlers for answer options
    card.querySelectorAll('.answer-option').forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update visual state
            card.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Store answer
            userAnswers[question.id] = radio.value;
        });
    });

    return card;
}

async function submitUnit() {
    // Check if all questions are answered
    const unanswered = currentQuestions.filter(q => !userAnswers[q.id]);
    if (unanswered.length > 0) {
        showError(`Please answer all questions before submitting. ${unanswered.length} questions remaining.`);
        return;
    }

    // Calculate score
    let correct = 0;
    currentQuestions.forEach(question => {
        if (userAnswers[question.id] === question.correct) {
            correct++;
        }
    });

    const score = Math.round((correct / currentQuestions.length) * 100);
    
    // Show results
    showUnitResults(correct, currentQuestions.length, score);
    
    // TODO: Save progress to database
    // await saveUnitProgress(currentChild.id, currentBook, currentUnit, userAnswers, score);
}

function showUnitResults(correct, total, score) {
    const container = document.getElementById('question-container');
    
    let message = '';
    let nextAction = '';
    
    if (score >= 80) {
        message = `Great job! You got ${correct} out of ${total} questions correct (${score}%).`;
        const unitCount = BOOK_UNITS[currentBook.level] || 25;
        
        if (currentUnit < unitCount) {
            nextAction = `<button id="next-unit" class="btn btn-primary">Next Unit</button>`;
        } else {
            nextAction = `<button id="complete-book" class="btn btn-primary">Complete Book</button>`;
        }
    } else {
        message = `You got ${correct} out of ${total} questions correct (${score}%). Let's review the questions you missed.`;
        nextAction = `<button id="retry-unit" class="btn btn-primary">Review Incorrect Answers</button>`;
    }

    container.innerHTML = `
        <div class="unit-complete">
            <h3>Unit ${currentUnit} Complete!</h3>
            <p>${message}</p>
            ${nextAction}
        </div>
    `;

    // Add event listeners for next actions
    document.getElementById('next-unit')?.addEventListener('click', () => {
        currentUnit++;
        loadUnit();
    });

    document.getElementById('complete-book')?.addEventListener('click', () => {
        showSuccess('Book completed! Great work!');
        setTimeout(() => {
            showView('child-dashboard');
        }, 2000);
    });

    document.getElementById('retry-unit')?.addEventListener('click', () => {
        // Show only incorrect questions
        showIncorrectQuestions();
    });
}

function showIncorrectQuestions() {
    const incorrectQuestions = currentQuestions.filter(q => 
        userAnswers[q.id] !== q.correct
    );

    currentQuestions = incorrectQuestions;
    userAnswers = {};
    renderQuestions();
}

function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
}

function showError(message) {
    // Simple error display - could be enhanced with a toast system
    alert('Error: ' + message);
}

function showSuccess(message) {
    // Simple success display - could be enhanced with a toast system
    alert(message);
}
