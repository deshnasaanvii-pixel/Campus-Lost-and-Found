document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const imageInput = document.getElementById('photo');
    const imagePreview = document.getElementById('imagePreview');
    const previewImgContainer = document.getElementById('previewImgContainer');
    let base64ImageString = "";

    // Set today's date as default in date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // 1. Live Image Selection & Base64 Converter
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (!file) return;

            // Enforce max 2MB size limit to avoid database issues
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size exceeds 2MB limit. Please pick a smaller file.');
                imageInput.value = '';
                if (previewImgContainer) previewImgContainer.style.display = 'none';
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                base64ImageString = reader.result;
                if (imagePreview) imagePreview.src = reader.result;
                if (previewImgContainer) previewImgContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    // 2. Form Submission Handling
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const postType = document.querySelector('input[name="postType"]:checked')?.value || 'lost';
            const title = document.getElementById('itemTitle')?.value?.trim() || '';
            const category = document.getElementById('category')?.value || 'General';
            const location = document.getElementById('location')?.value?.trim() || '';
            const date = document.getElementById('date')?.value || '';
            const contact = document.getElementById('contact')?.value?.trim() || '';
            const description = document.getElementById('description')?.value?.trim() || '';

            // Clean data payload for Person 2's Firebase integration
            const postPayload = {
                type: postType,
                title: title,
                category: category,
                location: location,
                date: date,
                contact: contact,
                description: description,
                image: base64ImageString || "https://via.placeholder.com/300x200?text=No+Image+Provided",
                createdAt: new Date().toISOString()
            };

            console.log('Post Payload Ready for Firebase:', postPayload);

            // Handshake with Person 2's backend script
            if (typeof window.savePostToFirebase === 'function') {
                window.savePostToFirebase(postPayload);
            } else {
                alert('✨ Post Submitted! (Ready for Person 2 Firebase integration)');
            }
        });
    }
});