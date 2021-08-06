const stripe = Stripe('pk_test_51DTe6bDTuLSYC5Nmgy1y2IvUVyEQk7NJ8E1lEap8T635HKlo6SSpEiqzpt5LJt1yAoDlMF2ZPKdJrC95vICaUUif00aPJayGoh');

const bookTour = async (tourId) => {
    // 1) Get checkout session from API
    const session = await fetch(`http://127.0.0.1:8090/api/vi/bookings/checkout-session/${tourId}`);
    const sessionData = await session.json();
    console.log(sessionData);

    // 2) Create checkout form + charge credit card
    await stripe.redirectoToCheckout({
        sessionId: session.data.session.id
    });
};

const bookBtn = document.getElementById('book-tour');

if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
        console.log('======YO!======')
        e.target.textContent = 'Processing...';
        // const tourId = e.target.dataset.tourId;
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}