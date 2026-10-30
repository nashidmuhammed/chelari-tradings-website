/**
 * CHELARI TRADINGS — MARKETING & GIFT EVENT ENGINE
 * Handles:
 * 1. 1-Click Copy Review Content & Multi-template selection
 * 2. Automated Google Reviews redirect
 * 3. Screenshot drag-and-drop file upload & live preview
 * 4. Form validation & Admin email submission
 * 5. Clean confirmation modal & WhatsApp direct link
 */

(function () {
  'use strict';

  // Configuration
  const EVENT_CONFIG = {
    // Admin email address where submissions will be sent
    adminEmail: 'contact@chelaritradings.com',

    // Admin WhatsApp number for instant verification
    adminWhatsApp: '919072555257',

    // Google Maps / Google Reviews Page URL
    googleReviewUrl: 'https://maps.google.com/?q=Chelari+Tradings',

    // Maximum allowed screenshot size in bytes (10MB)
    maxFileSizeBytes: 10 * 1024 * 1024,
  };

  // Review text templates (natural customer reviews)
  const REVIEW_TEMPLATES = {
    template1:
      "I received a gift from Chelari Tradings. Great showroom experience in Chelari with quality architectural glass, 100% Gurjan marine plywood, designer door handles, and modern kitchen accessories. The staff was very helpful and professional.",
    template2:
      "Visited Chelari Tradings and received a gift. Excellent collection of IS:710 marine plywood, fluted glass partitions, and smart biometric locks. Transparent guidance and prompt service.",
    template3:
      "Good experience at Chelari Tradings showroom. Sourced modular kitchen accessories, chimneys, and door hardware for our project. Organized display and helpful staff.",
  };

  // State
  let currentFile = null;
  let currentBase64 = null;

  document.addEventListener('DOMContentLoaded', initEventPage);

  function initEventPage() {
    initTemplateSelector();
    initCopyActions();
    initGoogleReviewActions();
    initScreenshotUploader();
    initEventForm();
    initStepperNavigation();
    initModalControls();
  }

  // ==========================================================================
  // 1. Template Selector & Copy Engine
  // ==========================================================================
  function initTemplateSelector() {
    const pills = document.querySelectorAll('.template-pill');
    const textarea = document.getElementById('review-content-textarea');
    const charCounter = document.getElementById('review-char-count');

    if (!textarea) return;

    updateCharCount();

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const key = pill.getAttribute('data-template');
        if (REVIEW_TEMPLATES[key]) {
          textarea.value = REVIEW_TEMPLATES[key];
          updateCharCount();

          const box = document.getElementById('review-preview-box');
          if (box) {
            box.style.borderColor = 'var(--accent-gold)';
            setTimeout(() => {
              box.style.borderColor = '';
            }, 300);
          }
        }
      });
    });

    textarea.addEventListener('input', updateCharCount);

    function updateCharCount() {
      if (charCounter && textarea) {
        charCounter.textContent = `${textarea.value.length} characters`;
      }
    }
  }

  function initCopyActions() {
    const copyBtn = document.getElementById('btn-copy-review');
    const comboBtn = document.getElementById('btn-copy-and-open');
    const textarea = document.getElementById('review-content-textarea');

    if (copyBtn && textarea) {
      copyBtn.addEventListener('click', () => {
        copyReviewText(false);
      });
    }

    if (comboBtn && textarea) {
      comboBtn.addEventListener('click', () => {
        copyReviewText(true);
      });
    }
  }

  function copyReviewText(openGoogleImmediately) {
    const textarea = document.getElementById('review-content-textarea');
    if (!textarea) return;

    const textToCopy = textarea.value.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => onCopySuccess(openGoogleImmediately))
        .catch(() => fallbackCopy(textarea, openGoogleImmediately));
    } else {
      fallbackCopy(textarea, openGoogleImmediately);
    }
  }

  function fallbackCopy(textarea, openGoogleImmediately) {
    try {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      onCopySuccess(openGoogleImmediately);
    } catch (err) {
      showToast('Please select and copy the text.');
    }
  }

  function onCopySuccess(openGoogleImmediately) {
    const copyBtn = document.getElementById('btn-copy-review');

    if (copyBtn) {
      copyBtn.classList.add('copied');
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied to Clipboard</span>
      `;

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalHtml;
      }, 3000);
    }

    setStepCompleted(1);
    setStepActive(2);

    if (openGoogleImmediately) {
      showToast('Copied. Opening Google Reviews...');
      setTimeout(() => {
        window.open(EVENT_CONFIG.googleReviewUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    } else {
      showToast('Review text copied. Open Google to paste.');
    }
  }

  // ==========================================================================
  // 2. Google Reviews Redirect Action
  // ==========================================================================
  function initGoogleReviewActions() {
    const googleBtn = document.getElementById('btn-open-google');
    if (googleBtn) {
      googleBtn.href = EVENT_CONFIG.googleReviewUrl;
      googleBtn.addEventListener('click', () => {
        setStepCompleted(2);
        setStepActive(3);
      });
    }
  }

  // ==========================================================================
  // 3. Screenshot Upload Handling
  // ==========================================================================
  function initScreenshotUploader() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('screenshot-file');
    const previewCard = document.getElementById('upload-preview-card');
    const previewImg = document.getElementById('preview-thumb-img');
    const fileNameEl = document.getElementById('preview-file-name');
    const fileSizeEl = document.getElementById('preview-file-size');
    const removeBtn = document.getElementById('preview-remove-btn');
    const uploadPrompt = document.getElementById('upload-prompt-content');

    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearSelectedFile();
      });
    }

    function handleFileSelect(file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (PNG, JPG, JPEG, or WebP).');
        return;
      }

      if (file.size > EVENT_CONFIG.maxFileSizeBytes) {
        alert('File is too large. Please select an image under 10MB.');
        return;
      }

      currentFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        currentBase64 = e.target.result;
        if (previewImg) previewImg.src = currentBase64;
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileSizeEl) fileSizeEl.textContent = formatBytes(file.size);

        if (uploadPrompt) uploadPrompt.style.display = 'none';
        if (previewCard) previewCard.style.display = 'flex';

        showToast('Screenshot attached.');
      };
      reader.readAsDataURL(file);
    }

    function clearSelectedFile() {
      currentFile = null;
      currentBase64 = null;
      fileInput.value = '';
      if (previewImg) previewImg.src = '';
      if (uploadPrompt) uploadPrompt.style.display = 'block';
      if (previewCard) previewCard.style.display = 'none';
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ==========================================================================
  // 4. Form Validation & Submission
  // ==========================================================================
  function initEventForm() {
    const form = document.getElementById('event-claim-form');
    const submitBtn = document.getElementById('btn-submit-event');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name')?.value.trim();
      const phone = document.getElementById('user-phone')?.value.trim();
      const email = document.getElementById('user-email')?.value.trim() || 'N/A';
      const googleName = document.getElementById('user-google-name')?.value.trim();
      const note = document.getElementById('user-note')?.value.trim() || 'N/A';

      if (!name || name.length < 2) {
        alert('Please enter your full name.');
        document.getElementById('user-name')?.focus();
        return;
      }

      if (!phone || phone.length < 7) {
        alert('Please enter a valid phone number for confirmation.');
        document.getElementById('user-phone')?.focus();
        return;
      }

      if (!googleName || googleName.length < 2) {
        alert('Please enter your Google account name to verify the review.');
        document.getElementById('user-google-name')?.focus();
        return;
      }

      if (!currentFile && !currentBase64) {
        alert('Please attach your review screenshot.');
        document.getElementById('upload-dropzone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const claimCode = generateClaimCode();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Submitting details...</span>`;
      }

      const formData = new FormData();
      formData.append('Claim ID', claimCode);
      formData.append('Full Name', name);
      formData.append('Phone', phone);
      formData.append('Email', email);
      formData.append('Google Reviewer Name', googleName);
      formData.append('Note', note);
      formData.append('Time', new Date().toLocaleString());
      formData.append('_subject', `[Gift Verification ${claimCode}] Review Submission from ${name}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      if (currentFile) {
        formData.append('Review Screenshot', currentFile);
      }

      const formSubmitEndpoint = `https://formsubmit.co/ajax/${EVENT_CONFIG.adminEmail}`;

      try {
        await fetch(formSubmitEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        }).catch((err) => {
          console.warn('Form submission caught:', err);
        });
      } catch (err) {
        console.warn('Network issue:', err);
      }

      try {
        localStorage.setItem(
          'chelari_last_claim',
          JSON.stringify({
            claimCode,
            name,
            phone,
            googleName,
            time: new Date().toISOString(),
          })
        );
      } catch (e) {}

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Submit Details & Screenshot</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }

      setStepCompleted(1);
      setStepCompleted(2);
      setStepCompleted(3);

      triggerSuccessModal({
        claimCode,
        name,
        phone,
        googleName,
      });
    });
  }

  function generateClaimCode() {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `CT-GIFT-${randomDigits}`;
  }

  // ==========================================================================
  // 5. Confirmation Modal
  // ==========================================================================
  function triggerSuccessModal(data) {
    const modal = document.getElementById('success-modal');
    const refEl = document.getElementById('receipt-claim-code');
    const nameEl = document.getElementById('receipt-name');
    const phoneEl = document.getElementById('receipt-phone');
    const waLink = document.getElementById('modal-wa-link');

    if (refEl) refEl.textContent = data.claimCode;
    if (nameEl) nameEl.textContent = data.name;
    if (phoneEl) phoneEl.textContent = data.phone;

    if (waLink) {
      const waMsg = encodeURIComponent(
        `Hello Chelari Tradings,\n\nI have submitted my Google review screenshot.\n\n` +
          `• Reference ID: ${data.claimCode}\n` +
          `• Name: ${data.name}\n` +
          `• Phone: ${data.phone}\n` +
          `• Google Name: ${data.googleName}\n\n` +
          `Please confirm verification. Thank you.`
      );
      waLink.href = `https://wa.me/${EVENT_CONFIG.adminWhatsApp}?text=${waMsg}`;
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function initModalControls() {
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('btn-close-modal');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ==========================================================================
  // 6. Stepper Navigation & Toast Notifications
  // ==========================================================================
  function initStepperNavigation() {
    const steps = document.querySelectorAll('.stepper-step');

    steps.forEach((step) => {
      step.addEventListener('click', () => {
        const targetStep = parseInt(step.getAttribute('data-step'), 10);
        let targetEl = null;

        if (targetStep === 1) targetEl = document.getElementById('step-section-1');
        if (targetStep === 2) targetEl = document.getElementById('step-section-2');
        if (targetStep === 3) targetEl = document.getElementById('step-section-3');

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setStepActive(targetStep);
        }
      });
    });
  }

  function setStepActive(stepNum) {
    document.querySelectorAll('.stepper-step').forEach((s) => {
      const num = parseInt(s.getAttribute('data-step'), 10);
      if (num === stepNum) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }

  function setStepCompleted(stepNum) {
    const stepEl = document.querySelector(`.stepper-step[data-step="${stepNum}"]`);
    if (stepEl) {
      stepEl.classList.add('completed');
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('event-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'event-toast';
      toast.className = 'event-toast';
      toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="toast-msg"></span>
      `;
      document.body.appendChild(toast);
    }

    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
})();
