// ============================================
// FEE CALCULATOR - Interactive Tuition Calculator
// ============================================

// Tuition rates by grade level and student type (in KSH per term)
const tuitionRates = {
    ecd: {
        day: 3000
    },
    lowerPrimary: {
        day: 5500,
        boarding: 11000
    },
    upperPrimary: {
        day: 6500,
        boarding: 12000
    },
    juniorSecondary: {
        day: 9500,
        boarding: 15000
    }
};

// Calculate total fees
function calculateFees() {
    const gradeLevel = document.getElementById('gradeLevel').value;
    const studentType = document.getElementById('studentType').value;

    // Validate inputs
    if (!gradeLevel || !studentType) {
        alert('Please select both grade level and student type');
        return;
    }

    // Get base tuition
    const baseTuition = tuitionRates[gradeLevel][studentType];

    // Calculate additional services
    let additionalFees = 0;
    const additionalServices = [];

    const lunch = document.getElementById('lunch');
    const porridge = document.getElementById('porridge');
    const interviewFee = document.getElementById('interviewFee');

    if (lunch && lunch.checked) {
        const fee = parseInt(lunch.value);
        additionalFees += fee;
        additionalServices.push({ name: 'Lunch for day scholars', fee: fee });
    }

    if (porridge && porridge.checked) {
        const fee = parseInt(porridge.value);
        additionalFees += fee;
        additionalServices.push({ name: 'Porridge', fee: fee });
    }

    if (interviewFee && interviewFee.checked) {
        const fee = parseInt(interviewFee.value);
        additionalFees += fee;
        additionalServices.push({ name: 'Interview and admission fees', fee: fee });
    }

    // Calculate total
    const totalFee = baseTuition + additionalFees;

    // Display results
    displayResults(baseTuition, additionalServices, totalFee);
}

// Display calculation results
function displayResults(baseTuition, additionalServices, totalFee) {
    const resultsDiv = document.getElementById('feeResults');
    const baseTuitionEl = document.getElementById('baseTuition');
    const totalFeeEl = document.getElementById('totalFee');
    const additionalFeesBreakdown = document.getElementById('additionalFeesBreakdown');

    // Format and display base tuition
    baseTuitionEl.textContent = formatCurrency(baseTuition);

    // Display additional services breakdown
    additionalFeesBreakdown.innerHTML = '';
    if (additionalServices.length > 0) {
        additionalServices.forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.style.cssText = 'display: flex; justify-content: space-between; padding-bottom: 0.75rem; border-bottom: 1px solid var(--gray-200);';
            serviceDiv.innerHTML = `
                <span style="color: var(--gray-600);">${service.name}:</span>
                <span>${formatCurrency(service.fee)}</span>
            `;
            additionalFeesBreakdown.appendChild(serviceDiv);
        });
    }

    // Display total
    totalFeeEl.textContent = formatCurrency(totalFee);

    // Show results with animation
    resultsDiv.style.display = 'block';
    resultsDiv.style.opacity = '0';
    resultsDiv.style.transform = 'translateY(20px)';

    setTimeout(() => {
        resultsDiv.style.transition = 'all 0.5s ease-out';
        resultsDiv.style.opacity = '1';
        resultsDiv.style.transform = 'translateY(0)';
    }, 10);

    // Scroll to results
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Format currency helper function for Kenyan Shillings
function formatCurrency(amount) {
    return 'KSH ' + new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Reset calculator
function resetCalculator() {
    document.getElementById('feeCalculatorForm').reset();
    document.getElementById('feeResults').style.display = 'none';
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Auto-calculate when selections change
    const gradeLevel = document.getElementById('gradeLevel');
    const studentType = document.getElementById('studentType');

    if (gradeLevel && studentType) {
        gradeLevel.addEventListener('change', function () {
            // Handle ECD selection - disable boarding
            if (this.value === 'ecd') {
                studentType.value = 'day';
                studentType.querySelectorAll('option').forEach(option => {
                    if (option.value === 'boarding') {
                        option.disabled = true;
                        option.style.display = 'none';
                    }
                });
            } else {
                // Re-enable boarding for other grades
                studentType.querySelectorAll('option').forEach(option => {
                    if (option.value === 'boarding') {
                        option.disabled = false;
                        option.style.display = 'block';
                    }
                });
            }

            if (studentType.value) {
                calculateFees();
            }
        });

        studentType.addEventListener('change', function () {
            if (gradeLevel.value) {
                calculateFees();
            }
        });
    }

    // Auto-calculate when checkboxes change
    const checkboxes = document.querySelectorAll('#feeCalculatorForm input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (gradeLevel.value && studentType.value) {
                calculateFees();
            }
        });
    });
});
