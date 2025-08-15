// UI Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle - only for logged in users
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    if (sidebarToggle && sidebar && main) {
        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 49;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        sidebarToggle.addEventListener('click', () => {
            // On mobile, toggle sidebar visibility
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
                main.classList.toggle('sidebar-open');
                if (sidebar.classList.contains('show')) {
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                } else {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }
            } else {
                // On desktop, toggle sidebar collapse
                sidebar.classList.toggle('sidebar-hidden');
                main.classList.toggle('full');
            }
        });
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            main.classList.remove('sidebar-open');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                main.classList.remove('sidebar-open');
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            } else {
                sidebar.classList.remove('sidebar-hidden');
                main.classList.remove('full');
            }
        });
        
        // Close sidebar on mobile when clicking nav links
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('show');
                    main.classList.remove('sidebar-open');
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Mobile touch enhancements
    if ('ontouchstart' in window) {
        // Add touch class for touch-specific styles
        document.body.classList.add('touch-device');
        
        // Improve touch feedback for buttons
        const touchElements = document.querySelectorAll('.btn, .nav-link, .card');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }

    // Form Validation
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.matches('#registerForm')) {
            const pw = form.querySelector('input[name="password"]').value;
            if (pw.length < 6) {
                e.preventDefault();
                showAlert('Password must be at least 6 characters', 'error');
            }
        }
    });

    // Close alert on click
    const alert = document.getElementById('alert');
    if (alert) {
        alert.addEventListener('click', () => {
            alert.classList.remove('show');
        });
    }
});

// Alert System
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.className = `alert alert-${type} show`;
        alert.innerHTML = `
            <svg class="nav-icon">
                <use href="/svg/icons.svg#icon-${type === 'success' ? 'success' : 'error'}"/>
            </svg>
            <span>${message}</span>
        `;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
}

// Loading Animation
function showLoading(container) {
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <svg class="nav-icon">
                    <use href="/svg/icons.svg#icon-loading"/>
                </svg>
            </div>
        `;
    }
}

// Expose functions globally
window.showAlert = showAlert;
window.showLoading = showLoading;

// Toggle full solution display
function toggleFullSolution(solutionId) {
    const element = document.getElementById('full-solution-' + solutionId);
    if (element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}

window.toggleFullSolution = toggleFullSolution;

// Rating System for Feedback Forms
function initializeRatingSystem() {
    // Handle multiple rating systems on the same page
    document.querySelectorAll('.rating').forEach(ratingContainer => {
        const formId = ratingContainer.id.split('-')[1]; // Get form index
        const ratingInput = document.getElementById(`ratingInput-${formId}`);
        const ratingDisplay = document.getElementById(`rating-display-${formId}`);
        const stars = ratingContainer.querySelectorAll('.star-btn');
        
        if (!ratingInput || !stars.length) return;
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.rating;
                ratingInput.value = rating;
                
                // Update visual state of stars
                stars.forEach(s => {
                    const starRating = s.dataset.rating;
                    s.classList.toggle('active', starRating <= rating);
                });
                
                // Update rating display text
                if (ratingDisplay) {
                    const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
                    ratingDisplay.textContent = `Rating: ${rating}/5 (${ratingTexts[rating]})`;
                    ratingDisplay.classList.add('rating-selected');
                }
            });
            
            // Add hover effect
            star.addEventListener('mouseenter', () => {
                const rating = star.dataset.rating;
                stars.forEach(s => {
                    const starRating = s.dataset.rating;
                    s.classList.toggle('hover', starRating <= rating);
                });
            });
        });
        
        // Reset hover effect when leaving rating container
        ratingContainer.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

// Toggle feedback form visibility
function toggleFeedbackForm(formIndex) {
    const formContainer = document.getElementById(`feedback-form-${formIndex}`);
    if (formContainer) {
        if (formContainer.style.display === 'none' || formContainer.style.display === '') {
            formContainer.style.display = 'block';
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            formContainer.style.display = 'none';
        }
    }
}

// Expose the toggle function globally
window.toggleFeedbackForm = toggleFeedbackForm;

// Share functionality
function initializeShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', async () => {
        try {
            const title = document.querySelector('.page-title').textContent;
            const description = document.querySelector('.query-content p').textContent;
            
            await navigator.share({
                title: title,
                text: description.substring(0, 100) + '...',
                url: window.location.href
            });
        } catch (err) {
            // Fallback to copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                showAlert('Link copied to clipboard!', 'success');
            } catch (clipboardErr) {
                showAlert('Unable to share link', 'error');
            }
        }
    });
}

// Like Button Animation
function initializeLikeButtons() {
    console.log('Initializing like buttons...');
    const likeButtons = document.querySelectorAll('.like-btn');
    console.log(`Found ${likeButtons.length} like buttons`);
    
    likeButtons.forEach((btn, index) => {
        console.log(`Setting up like button ${index + 1}, tip ID: ${btn.dataset.tipId}`);
        
        // Remove any existing listeners to prevent duplicates
        btn.removeEventListener('click', handleLikeClick);
        btn.addEventListener('click', handleLikeClick);
    });
    
    if (likeButtons.length === 0) {
        console.warn('No like buttons found! Make sure elements have class "like-btn"');
    }
}

function handleLikeClick(event) {
    event.preventDefault();
    console.log('Like button clicked!');
    
    const btn = event.currentTarget;
    const tipId = btn.dataset.tipId;
    console.log('Tip ID:', tipId);
    
    if (!tipId) {
        console.error('No tip ID found');
        showAlert('Error: Unable to identify tip', 'error');
        return;
    }
    
    // Add loading state
    btn.disabled = true;
    btn.classList.add('loading');
    
    // Make API call to toggle like
    fetch(`/user/tips/${tipId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Like response:', data);
        
        if (data.success) {
            // Update button state
            if (data.isLiked) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Add pulse animation to icon
            const icon = btn.querySelector('.heart-icon');
            if (icon) {
                icon.classList.remove('pulse');
                setTimeout(() => icon.classList.add('pulse'), 10);
                setTimeout(() => icon.classList.remove('pulse'), 1000);
            }
            
            // Update like count
            const countEl = btn.querySelector('.like-count');
            if (countEl) {
                countEl.textContent = data.likeCount;
                console.log('Updated count to:', data.likeCount);
            }
            
            // Show success message
            showAlert(data.message, 'success');
        } else {
            console.error('Like failed:', data.message);
            showAlert(data.message || 'Failed to update like', 'error');
        }
    })
    .catch(error => {
        console.error('Error toggling like:', error);
        showAlert('Network error. Please try again.', 'error');
    })
    .finally(() => {
        // Remove loading state
        btn.disabled = false;
        btn.classList.remove('loading');
    });
}

// Initialize all interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRatingSystem();
    initializeShareButton();
    initializeLikeButtons();
});

// Initialize per-tip share and like buttons (on pages like /user/tips)
function initializeTipShareAndLike() {
    console.log('Initializing tip share and like functionality...');
    
    try {
        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.preventDefault();
                console.log('Share button clicked');
                
                const tipCard = this.closest('.tip-card');
                const tipId = this.dataset.tipId;
                const title = tipCard ? tipCard.querySelector('.tip-title').textContent : document.title;
                const text = tipCard ? tipCard.querySelector('.tip-content p').textContent : document.title;

                try {
                    if (navigator.share) {
                        await navigator.share({ 
                            title: `Health Tip: ${title}`, 
                            text: text.substring(0, 140) + '...', 
                            url: window.location.origin + window.location.pathname + '#tip-' + tipId 
                        });
                        showAlert('Tip shared successfully!', 'success');
                    } else {
                        // Fallback: copy URL to clipboard
                        const shareUrl = window.location.origin + window.location.pathname + '#tip-' + tipId;
                        await navigator.clipboard.writeText(shareUrl);
                        showAlert('Tip link copied to clipboard', 'success');
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Share failed', err);
                        showAlert('Unable to share tip', 'error');
                    }
                }
            });
        });

        // Save buttons
        document.querySelectorAll('.btn-ghost').forEach(btn => {
            if (btn.textContent.trim().includes('Save')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Save button clicked');
                    
                    this.classList.toggle('saved');
                    
                    if (this.classList.contains('saved')) {
                        this.innerHTML = `
                            <svg class="icon">
                                <use href="/svg/icons.svg#icon-bookmark-fill"/>
                            </svg>
                            Saved
                        `;
                        showAlert('Tip saved for later', 'success');
                    } else {
                        this.innerHTML = `
                            <svg class="icon">
                                <use href="/svg/icons.svg#icon-bookmark"/>
                            </svg>
                            Save
                        `;
                        showAlert('Tip removed from saved', 'info');
                    }
                });
            }
        });

        // Like buttons - call initializeLikeButtons to ensure they work
        console.log('Initializing like buttons for tips page...');
        initializeLikeButtons();
        
        // Initialize category filtering
        initializeTipFiltering();
    } catch (error) {
        console.error('Error initializing tip functionality:', error);
    }
}

// Category filtering for tips
function initializeTipFiltering() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tipsCount = document.getElementById('tipsCount');
    
    if (categoryFilter && tipsCount) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const tipCards = document.querySelectorAll('.tip-card');
            let visibleCount = 0;
            
            tipCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const shouldShow = !selectedCategory || cardCategory === selectedCategory;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            tipsCount.textContent = visibleCount;
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize all interactive elements
    initializeRatingSystem();
    initializeShareButton();
    initializeLikeButtons();
    
    // If we're on the user tips page, wire up tip-specific handlers
    if (window.location.pathname === '/user/tips' || window.location.pathname === '/tips' ) {
        console.log('On tips page, initializing tip features...');
        initializeTipShareAndLike();
    }
    
    // If we're on the expert tips page, wire up tip management handlers
    if (window.location.pathname === '/expert/tips') {
        console.log('On expert tips page, initializing management features...');
        initializeTipManagement();
    }
});

// Tip Management for Expert Tips Page
function initializeTipManagement() {
    // Delete tip buttons
    document.querySelectorAll('.delete-tip').forEach(btn => {
        btn.addEventListener('click', async function() {
            const tipId = this.dataset.tipId;
            
            if (confirm('Are you sure you want to delete this tip?')) {
                try {
                    const response = await fetch(`/expert/tip/${tipId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        showAlert(data.message, 'success');
                        // Remove the tip card from DOM
                        this.closest('.tip-card').remove();
                    } else {
                        throw new Error('Failed to delete tip');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Failed to delete tip', 'error');
                }
            }
        });
    });
    
    // Toggle tip status buttons
    document.querySelectorAll('.toggle-tip-status').forEach(btn => {
        btn.addEventListener('click', async function() {
            const tipId = this.dataset.tipId;
            const isPublished = this.dataset.published === 'true';
            
            try {
                const response = await fetch(`/expert/tip/${tipId}/toggle`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update button appearance and text
                    if (data.isPublished) {
                        this.innerHTML = `
                            <svg class="icon" width="14" height="14">
                                <use href="/svg/icons.svg#icon-pause"/>
                            </svg>
                            Unpublish
                        `;
                        this.dataset.published = 'true';
                        
                        // Update status badge
                        const statusBadge = this.closest('.tip-card').querySelector('.tip-status');
                        statusBadge.className = 'tip-status badge badge-success';
                        statusBadge.textContent = 'Published';
                    } else {
                        this.innerHTML = `
                            <svg class="icon" width="14" height="14">
                                <use href="/svg/icons.svg#icon-play"/>
                            </svg>
                            Publish
                        `;
                        this.dataset.published = 'false';
                        
                        // Update status badge
                        const statusBadge = this.closest('.tip-card').querySelector('.tip-status');
                        statusBadge.className = 'tip-status badge badge-warning';
                        statusBadge.textContent = 'Draft';
                    }
                    
                    showAlert(data.message, 'success');
                } else {
                    throw new Error('Failed to toggle tip status');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('Failed to update tip status', 'error');
            }
        });
    });
}

// Expert Dashboard Functions
function initializeExpertDashboard() {
    // Toggle solution forms
    document.querySelectorAll('.toggle-solution-form').forEach(btn => {
        btn.addEventListener('click', function() {
            const queryId = this.dataset.queryId;
            const form = document.getElementById('form-' + queryId);
            const isVisible = form.style.display !== 'none';
            
            form.style.display = isVisible ? 'none' : 'block';
            this.innerHTML = isVisible ? 
                '<svg class="icon" width="16" height="16"><use href="/svg/icons.svg#icon-plus"/></svg> Provide Solution' :
                '<svg class="icon" width="16" height="16"><use href="/svg/icons.svg#icon-minus"/></svg> Cancel';
        });
    });
    
    // Cancel solution
    document.querySelectorAll('.cancel-solution').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('.solution-form');
            const toggleBtn = form.parentElement.querySelector('.toggle-solution-form');
            form.style.display = 'none';
            toggleBtn.innerHTML = '<svg class="icon" width="16" height="16"><use href="/svg/icons.svg#icon-plus"/></svg> Provide Solution';
        });
    });
}

// Initialize expert dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the expert dashboard page
    if (window.location.pathname === '/expert') {
        initializeExpertDashboard();
    }
});

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Solution Management Functions
document.addEventListener('DOMContentLoaded', function() {
    // Toggle solution submission status
    document.querySelectorAll('.toggle-submission').forEach(btn => {
        btn.addEventListener('click', async function() {
            const solutionId = this.dataset.solutionId;
            const isSubmitted = this.dataset.isSubmitted === 'true';
            
            try {
                const response = await fetch(`/expert/solution/${solutionId}/toggle`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update button appearance and text
                    if (data.isSubmitted) {
                        this.className = this.className.replace('btn-success', 'btn-warning');
                        this.innerHTML = `
                            <svg class="icon" width="12" height="12">
                                <use href="/svg/icons.svg#icon-edit"/>
                            </svg>
                            Mark as Draft
                        `;
                        this.dataset.isSubmitted = 'true';
                        
                        // Update badge
                        const badge = this.closest('.expert-query-card').querySelector('.badge');
                        badge.className = 'badge badge-success';
                        badge.innerHTML = `
                            <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-check"/></svg>
                            Submitted
                        `;
                    } else {
                        this.className = this.className.replace('btn-warning', 'btn-success');
                        this.innerHTML = `
                            <svg class="icon" width="12" height="12">
                                <use href="/svg/icons.svg#icon-send"/>
                            </svg>
                            Submit Solution
                        `;
                        this.dataset.isSubmitted = 'false';
                        
                        // Update badge
                        const badge = this.closest('.expert-query-card').querySelector('.badge');
                        badge.className = 'badge badge-warning';
                        badge.innerHTML = `
                            <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-edit"/></svg>
                            Draft
                        `;
                    }
                    
                                    showAlert(data.isSubmitted ? 'Solution submitted successfully!' : 'Solution marked as draft', 'success');
                } else {
                    throw new Error('Failed to toggle submission status');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Failed to update solution status', 'error');
            }
        });
    });
    
    // Handle edit solution buttons
    document.querySelectorAll('.edit-solution').forEach(btn => {
        btn.addEventListener('click', function() {
            const solutionId = this.dataset.solutionId;
            const editForm = document.getElementById(`edit-form-${solutionId}`);
            const solutionContent = document.getElementById(`solution-content-${solutionId}`);
            
            if (editForm.style.display === 'none') {
                editForm.style.display = 'block';
                solutionContent.style.display = 'none';
                this.textContent = 'Cancel Edit';
            } else {
                editForm.style.display = 'none';
                solutionContent.style.display = 'block';
                this.innerHTML = `
                    <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-edit"/></svg>
                    Edit
                `;
            }
        });
    });

    // View full solution buttons (CSP-safe: no inline handlers)
    document.querySelectorAll('.view-full-solution').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.solutionId;
            const panel = document.getElementById(`full-solution-${id}`);
            if (!panel) return;
            panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
            this.textContent = panel.style.display === 'block' ? 'Hide Full Solution' : 'View Full Solution';
        });
    });

    // Profile page: Edit profile modal logic (moved from inline script)
    const editBtn = document.getElementById('editProfileBtn');
    const modal = document.getElementById('editModal');
    if (editBtn && modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancelEdit');

        editBtn.addEventListener('click', () => modal.classList.add('show'));
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
    }

    // Queries page: Toggle answered queries filter (moved from inline script)
    const answeredToggle = document.getElementById('showAnsweredOnly');
    if (answeredToggle) {
        const cards = document.querySelectorAll('.query-card');
        answeredToggle.addEventListener('change', () => {
            cards.forEach(card => {
                const isAnswered = card.querySelector('.badge-success') !== null;
                card.style.display = answeredToggle.checked && !isAnswered ? 'none' : 'block';
            });
        });
    }
    
    // Handle cancel edit buttons
    document.querySelectorAll('.cancel-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('.edit-solution-form');
            const solutionId = form.id.replace('edit-form-', '');
            const solutionContent = document.getElementById(`solution-content-${solutionId}`);
            const editBtn = form.parentElement.querySelector('.edit-solution');
            
            form.style.display = 'none';
            solutionContent.style.display = 'block';
            editBtn.innerHTML = `
                <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-edit"/></svg>
                Edit
            `;
        });
    });
});

// Helper function to show messages
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} slide-in`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        min-width: 250px;
        padding: 1rem;
        border-radius: var(--radius-md);
        background: ${type === 'success' ? 'var(--success-500)' : type === 'error' ? 'var(--danger-500)' : 'var(--primary-500)'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Enhanced Feedback System
document.addEventListener('DOMContentLoaded', function() {
    // Toggle feedback forms
    document.querySelectorAll('.toggle-feedback-form').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const form = document.getElementById(targetId);
            
            if (form) {
                if (form.style.display === 'none' || !form.style.display) {
                    form.style.display = 'block';
                    this.textContent = 'Cancel';
                    this.className = this.className.replace('btn-outline', 'btn-ghost');
                } else {
                    form.style.display = 'none';
                    this.innerHTML = `
                        <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-feedback"/></svg>
                        ${targetId === 'generalFeedbackForm' ? 'Give General Feedback' : 'Give Feedback'}
                    `;
                    this.className = this.className.replace('btn-ghost', 'btn-outline');
                }
            }
        });
    });
    // New toggle buttons (from queryDetail2.ejs) that use data-target
    document.querySelectorAll('.toggle-feedback-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const form = document.getElementById(targetId);
            if (!form) return;
            form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
            // Update button text
            this.textContent = form.style.display === 'block' ? 'Cancel' : 'Give Feedback';
        });
    });

    document.querySelectorAll('.cancel-feedback-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const form = document.getElementById(targetId);
            if (!form) return;
            form.style.display = 'none';
        });
    });
    
    // Cancel feedback buttons
    document.querySelectorAll('.cancel-feedback').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('.feedback-form-container');
            const toggleBtn = form.parentElement.querySelector('.toggle-feedback-form');
            
            form.style.display = 'none';
            toggleBtn.innerHTML = `
                <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-feedback"/></svg>
                ${form.id === 'generalFeedbackForm' ? 'Give General Feedback' : 'Give Feedback'}
            `;
            toggleBtn.className = toggleBtn.className.replace('btn-ghost', 'btn-outline');
            
            // Reset form
            form.querySelector('form').reset();
            form.querySelectorAll('.star-btn').forEach(star => star.classList.remove('active'));
            const ratingInput = form.querySelector('input[name="rating"]');
            if (ratingInput) ratingInput.value = '';
        });
    });
    
    // Enhanced rating system for multiple forms
    document.querySelectorAll('.rating').forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('.star-btn');
        const input = ratingContainer.querySelector('input[name="rating"]');
        
        if (!input) {
            console.warn('Rating input not found in:', ratingContainer);
            return;
        }
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                input.value = rating;
                
                console.log('Rating set to:', rating, 'Input value:', input.value);
                
                // Update visual state
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            // Hover effects
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            });
        });
        
        ratingContainer.addEventListener('mouseleave', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
    
    // Handle feedback form submissions
    document.querySelectorAll('.feedback-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const expertName = this.dataset.expertName;
            const formData = new FormData(this);
            // Convert FormData to plain object so we can send JSON (Express parses JSON)
            const payload = {};
            for (const [k, v] of formData.entries()) {
                payload[k] = v;
            }

            // Debug: Log payload
            console.log('Submitting feedback form:', { expertName, payload });
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-feedback');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg class="icon" width="16" height="16"><use href="/svg/icons.svg#icon-loading"/></svg>
                Sending...
            `;
            submitBtn.disabled = true;
            
            // Submit JSON so Express's json parser handles it reliably
            fetch('/user/feedback', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                return response.json().then(data => ({ ok: response.ok, data }));
            })
            .then(({ ok, data }) => {
                if (ok && data && data.success) {
                    // Show success message
                    const successAlert = document.getElementById('feedbackSuccess');
                    const expertText = expertName === 'General' ? 'general feedback' : `feedback to ${expertName}`;
                    successAlert.querySelector('span').textContent = `Your ${expertText} has been submitted successfully! Thank you for your response.`;
                    successAlert.style.display = 'flex';
                    
                    // Hide the form
                    const formContainer = this.closest('.feedback-form-container');
                    const toggleBtn = formContainer.parentElement.querySelector('.toggle-feedback-form');
                    formContainer.style.display = 'none';
                    
                    // Reset toggle button
                    toggleBtn.innerHTML = `
                        <svg class="icon" width="12" height="12"><use href="/svg/icons.svg#icon-check"/></svg>
                        Feedback Sent
                    `;
                    toggleBtn.className = toggleBtn.className.replace('btn-outline', 'btn-success');
                    toggleBtn.disabled = true;
                    
                    // Reset form
                    this.reset();
                    this.querySelectorAll('.star-btn').forEach(star => star.classList.remove('active'));
                    const ratingInput = this.querySelector('input[name="rating"]');
                    if (ratingInput) ratingInput.value = '';
                    
                    // Scroll to success message
                    successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successAlert.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error((data && data.error) || 'Failed to submit feedback');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Failed to submit feedback. Please try again.', 'error');
            })
            .finally(() => {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    });
});
