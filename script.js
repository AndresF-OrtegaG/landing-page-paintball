document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Configuración y Estado ---
    const form = document.querySelector('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input:not([type="radio"])');
    const navLinks = document.querySelectorAll('nav[aria-label="Navegación principal"] a');
    const revealSections = document.querySelectorAll('section');

    /**
     * 1. GESTIÓN DE FORMULARIO (VALIDACIÓN PROGRESIVA)
     */
    const validationRules = {
        'nombre-lider': (val) => val.trim().length >= 4,
        'email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'telefono': (val) => /^\d{7,15}$/.test(val.replace(/\s/g, '')),
        'miembros': (val) => val >= 4 && val <= 7
    };

    const toggleError = (input, isValid) => {
        const container = input.parentElement;
        let errorSpan = container.querySelector('.error-msg');

        if (!isValid) {
            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'error-msg';
                errorSpan.style.color = 'var(--primary-color)';
                errorSpan.style.fontSize = '0.8rem';
                errorSpan.style.marginTop = '0.5rem';
                errorSpan.textContent = `Por favor, verifica este campo.`;
                container.appendChild(errorSpan);
            }
            input.setAttribute('aria-invalid', 'true');
        } else {
            if (errorSpan) errorSpan.remove();
            input.removeAttribute('aria-invalid');
        }
    };

    const validateFormState = () => {
        const isFieldsValid = Array.from(inputs).every(input => 
            validationRules[input.id] ? validationRules[input.id](input.value) : input.checkValidity()
        );
        // Nota: En el HTML proporcionado no hay radios, pero se deja lógica preparada
        const isRadioValid = form.querySelector('input[type="radio"]') 
            ? !!form.querySelector('input[type="radio"]:checked') 
            : true;

        submitBtn.disabled = !(isFieldsValid && isRadioValid);
    };

    // Inicializar estado del botón
    submitBtn.disabled = true;

    // Eventos de validación
    form.addEventListener('blur', (e) => {
        if (e.target.tagName === 'INPUT') {
            const isValid = validationRules[e.target.id] 
                ? validationRules[e.target.id](e.target.value) 
                : e.target.checkValidity();
            toggleError(e.target, isValid);
            validateFormState();
        }
    }, true);

    form.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const isValid = validationRules[e.target.id] 
                ? validationRules[e.target.id](e.target.value) 
                : e.target.checkValidity();
            
            if (isValid) toggleError(e.target, true);
            validateFormState();
        }
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Simulación de API
        setTimeout(() => {
            console.log('Formulario enviado con éxito');
            form.reset();
            submitBtn.textContent = '¡Registrado!';
        }, 2000);
    });

    /**
     * 2. INTERACTIVIDAD Y SCROLL
     */
    
    // Smooth Scroll (Fallback para navegadores antiguos y control JS)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer para Revelado de Elementos
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar una vez revelado para mejorar performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealSections.forEach(section => {
        section.classList.add('reveal-init');
        revealOnScroll.observe(section);
    });
});