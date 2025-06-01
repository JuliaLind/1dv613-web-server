<script setup>
defineProps({
  visible: Boolean
})

defineEmits(['update:visible'])
</script>

<template>
    <section>
      <details>
        <summary>1. General Use</summary>
        <p>
          This application is designed to support general wellness and nutrition tracking. It is not intended for
          diagnostic or therapeutic use. You must be at least 18 years old to use this application.
        </p>
      </details>

      <details>
        <summary>2. Medical Disclaimer</summary>
        <p>
          This application has not been developed by a licensed medical professional, nor reviewed by any certified
          healthcare provider. It serves purely as a general guidance tool and must not be used as a substitute for
          professional medical advice, diagnosis, or treatment.
        </p>
        <p>
          Always consult your doctor or a qualified health provider before making any changes to your diet or
          lifestyle. If you feel unwell or experience any symptoms, discontinue use and seek medical help immediately.
        </p>
      </details>

      <details>
        <summary>3. Use of Suggestions</summary>
        <p>
          The application may, based on your inputs (e.g. age, activity level, goals), suggest caloric or dietary
          targets. However, these recommendations are not guaranteed to be medically safe or appropriate.
        </p>
        <p>
          You must use your own judgment and consult professionals where necessary. The developer assumes no
          responsibility for any outcomes from using the application.
        </p>
      </details>

      <details>
        <summary>4. Eating Disorder Warning</summary>
        <p>
          This application is not suitable for individuals suffering from eating disorders such as anorexia nervosa,
          bulimia, or binge eating disorder. Features like gamification and progress tracking may worsen such
          conditions.
        </p>
        <p>
          If you are affected by or suspect an eating disorder, please refrain from using the app and consult a
          qualified medical professional.
        </p>
      </details>

      <details>
        <summary>5. GDPR and Data Protection</summary>
        <p>
          We collect and process personal data in accordance with the General Data Protection Regulation (GDPR).
        </p>
        <p>
          Personal data such as email and date of birth are stored in a secure, access-controlled database, separate
          from pseudonymized health-related data (e.g. age, weight, activity level). These datasets are connected only
          by a technical identifier and are protected through strict access controls.
        </p>
        <p>
          Users may delete all their data at any time by using the <strong>Delete Account</strong> form available inside
          the application.
        </p>
        <p>
          Please note that at this time, users cannot export their personal data, nor can they edit their email address,
          date of birth, or password through the application.
        </p>
      </details>

      <details>
        <summary>6. Acceptance of Risk</summary>
        <p>
          By using this app, you acknowledge the above disclaimers and agree to use the application at your own risk.
        </p>
      </details>
    </section>
</template>

<style scoped>
.terms-container {
  color: var(--base-font-grey);
}



.p-drawer-header {
  padding: 0.25rem !important;
}

details {
  margin-bottom: 1rem;
  border: 1px solid var(--grey-300);
  border-radius: 5px;
  padding: 1rem;
  background-color: var(--grey-100);
}

summary {
  font-weight: bold;
  cursor: pointer;
  outline: none;
}

summary::-webkit-details-marker {
  display: none;
}

details[open] summary {
  color: var(--primary-900);
}

p {
  margin: 0.5rem 0 0 0;
}
</style>
