<script setup>
defineProps({
  visible: Boolean
})

defineEmits(['update:visible'])
</script>

<template>
  <section>
    <!-- Student Project Disclaimer -->
    <details open>
      <summary>Project Status</summary>
      <p>
        <strong>Note:</strong> This application is a first-year student project developed by Julia Lind. Users should
        understand
        that features, support, and updates are provided on a best-effort basis and may be limited in scope or
        frequency.
      </p>
    </details>

    <!-- 1. General Use -->
    <details>
      <summary>1. General Use</summary>
      <p>
        This application is designed to support general wellness and nutrition tracking. It is not intended for
        diagnostic or therapeutic use. You must be at least 18 years old to use this application.
      </p>
      <p>
        By providing your date of birth during registration, you confirm that you are at least 18 years old. If you
        are under 18, you are not permitted to register or use this service.
      </p>
    </details>

    <!-- 2. Medical Disclaimer -->
    <details>
      <summary>2. Medical Disclaimer</summary>
      <p>
        This application was not developed by a licensed medical professional and has not been reviewed by any
        certified healthcare provider. It serves only as general guidance and must not replace professional
        medical advice, diagnosis, or treatment.
      </p>
      <p>
        Always consult your doctor or a qualified healthcare provider before making any changes to your diet or
        lifestyle. If you feel unwell or experience any symptoms, discontinue use and seek medical help immediately.
      </p>
    </details>

    <!-- 3. Use of Suggestions -->
    <details>
      <summary>3. Use of Suggestions</summary>
      <p>
        Based on the data you enter (e.g., age, activity level, weight goals), the application may suggest caloric
        or dietary targets. These are only guidelines and are not guaranteed to be safe or appropriate for every
        individual.
      </p>
      <p>
        You must use your own judgment and, when in doubt, consult a qualified professional. The developer assumes
        no responsibility for any outcomes resulting from the use of these suggestions.
      </p>
    </details>

    <!-- 4. Eating Disorder Warning -->
    <details>
      <summary>4. Eating Disorder Warning</summary>
      <p>
        This application is not suitable for individuals suffering from eating disorders (e.g., anorexia nervosa,
        bulimia, binge eating disorder). Features like gamification and progress tracking may worsen such
        conditions.
      </p>
      <p>
        If you are affected by or suspect an eating disorder, please refrain from using the app and consult a
        qualified medical professional.
      </p>
    </details>

    <!-- 5. GDPR & Data Protection -->
    <details>
      <summary>5. GDPR &amp; Data Protection</summary>

      <!-- 5.1 Controller & Contact -->
      <h4>5.1 Data Controller &amp; Contact</h4>
      <p>
        The data controller for this application is <strong>Julia Lind</strong>. If you have questions regarding
        your personal data or wish to exercise any GDPR rights, please contact:
      </p>
      <ul>
        <li>Email: <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a></li>
      </ul>

      <!-- 5.2 What Data We Collect & Why -->
      <h4>5.2 What Data We Collect &amp; Why</h4>
      <p>
        We collect two categories of personal data. “Required Data” is stored on Server 1; “Voluntary Data” is stored
        on Server 2. By providing voluntary data and clicking “Save,” you consent to its processing.
      </p>

      <!-- 5.2.1 Required Data (Server 1) -->
      <h5>5.2.1 Required Data (Server 1)</h5>
      <ul>
        <li>
          <strong>Email &amp; Password (hashed)</strong>
          <ul>
            <li><em>Purpose:</em> Authenticate and manage your account.</li>
            <li><em>Legal Basis:</em> Performance of a contract (GDPR Art. 6(1)(b)).</li>
            <li><em>Storage Location:</em> DigitalOcean droplet in Frankfurt (FRA1), Germany (10.114.0.0/20).</li>
            <li><em>Retention:</em> Deleted immediately when you successfully submit the Delete Account form.</li>
          </ul>
        </li>
        <li>
          <strong>Date of Birth</strong>
          <ul>
            <li><em>Purpose:</em> Verify you are at least 18 years old and calculate age for any age-dependent features.
            </li>
            <li><em>Legal Basis:</em> Legal obligation/legitimate interest (GDPR Art. 6(1)(c) &amp; (f)).</li>
            <li><em>Storage Location:</em> DigitalOcean droplet in Frankfurt (FRA1), Germany (10.114.0.0/20).</li>
            <li><em>Retention:</em> Deleted immediately when you successfully submit the Delete Account form.</li>
          </ul>
        </li>
      </ul>

      <!-- 5.2.2 Voluntary Data (Server 2) -->
      <h5>5.2.2 Voluntary Data (Server 2)</h5>
      <p>
        After registration, you may choose to enter additional information. By entering any of the following fields
        and clicking “Save,” you consent to our processing of that data.
      </p>
      <ul>
        <li>
          <strong>Height, Current Weight, Goal Weight, Activity Level, Target Weight Loss per Week</strong>
          <ul>
            <li><em>Purpose:</em> Calculate personalized caloric targets, track progress, and set goals.</li>
            <li><em>Legal Basis:</em> Your consent (GDPR Art. 6(1)(a)), given implicitly when you enter and click
              “Save.”</li>
            <li><em>Storage Location:</em> DigitalOcean droplet in Frankfurt (FRA1), Germany (10.114.0.0/20).</li>
            <li><em>Retention:</em> Deleted immediately when you successfully submit the Delete Account form. Otherwise,
              data remains until that deletion.</li>
          </ul>
        </li>
        <li>
          <strong>Weight &amp; Age History Records (with timestamps)</strong>
          <ul>
            <li><em>Purpose:</em> Monitor your progress over time and refine suggestions.</li>
            <li><em>Legal Basis:</em> Your consent (GDPR Art. 6(1)(a)), given implicitly when you save history entries.
            </li>
            <li><em>Storage Location:</em> DigitalOcean droplet in Frankfurt (FRA1), Germany (10.114.0.0/20).</li>
            <li><em>Retention:</em> Deleted immediately when you successfully submit the Delete Account form. Otherwise,
              data remains until that deletion.</li>
          </ul>
        </li>
        <li>
          <strong>Meal Logs (Food Item Name, EAN Code, Weight, Unit, Timestamp)</strong>
          <ul>
            <li><em>Purpose:</em> Calculate nutritional intake and provide feedback.</li>
            <li><em>Legal Basis:</em> Your consent (GDPR Art. 6(1)(a)), given implicitly when you log meals and click
              “Save.”</li>
            <li><em>Storage Location:</em> DigitalOcean droplet in Frankfurt (FRA1), Germany (10.114.0.0/20).</li>
            <li><em>Retention:</em> Deleted immediately when you successfully submit the Delete Account form. Otherwise,
              data remains until that deletion.</li>
          </ul>
        </li>
      </ul>

      <!-- 5.3 How We Share & Protect Your Data -->
      <h4>5.3 How We Share &amp; Protect Your Data</h4>
      <p>
        We do not share your personal data with any third-party processors. All data is hosted on a single DigitalOcean
        droplet in Frankfurt (FRA1) (10.114.0.0/20), within the EEA.
      </p>
      <h5>5.3.1 Security Measures</h5>
      <ul>
        <li><strong>Encryption in Transit:</strong> All communications use HTTPS (TLS).</li>
        <li><strong>Encryption at Rest:</strong> Data is stored on unencrypted volumes (unless DigitalOcean provides
          encryption by default).</li>
        <li><strong>Pseudonymization:</strong> Required data (Server 1) is kept on a separate database from voluntary
          data (Server 2). No other anonymization steps are applied.</li>
        <li>
          <strong>Access Controls &amp; Logging:</strong>
          <ul>
            <li>Julia Lind is the only person with access to the servers. Access credentials are managed via a key
              stored on GitHub for CI/CD.</li>
            <li>No additional access controls or logs (beyond DigitalOcean's defaults) are in place.</li>
          </ul>
        </li>
        <li><strong>Vulnerability Scanning / Pen Testing:</strong> No security scans or penetration testing are
          performed beyond any default measures by DigitalOcean.</li>
      </ul>

      <!-- 5.4 Your GDPR Rights -->
      <h4>5.4 Your GDPR Rights &amp; How to Exercise Them</h4>
      <p>
        Under the GDPR, you have the rights listed below. To exercise any of these rights, please email
        <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a>. We will respond within one year of a valid
        request.
      </p>
      <ul>
        <li>
          <strong>Right of Access (Art. 15):</strong>
          <ul>
            <li>You can request a copy of all data we hold about you, including:</li>
            <li>- Required Data: Email, date of birth.</li>
            <li>- Voluntary Data: Height, weight history, activity level, meal logs.</li>
            <li>To receive an export, email us and we will provide a JSON extract within one year of your request.</li>
          </ul>
        </li>

        <li>
          <strong>Right to Rectification (Art. 16):</strong>
          <ul>
            <li><em>Required Data:</em> You cannot edit email, date of birth, or password in-app. To request
              corrections, email <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a>, and corrections
              will be made manually.</li>
            <li><em>Voluntary Data:</em> You may edit your height, current weight, and other voluntary fields in-app.
              However, historical entries (past days' weight, past meal logs) cannot be edited once saved.</li>
          </ul>
        </li>

        <li>
          <strong>Right to Erasure (Art. 17):</strong>
          <ul>
            <li>Use the “Delete Account” form in “Settings → Danger Zone.” You must enter your email and password, and
              then confirm the prompt. Once successful, all your data on both servers is deleted immediately.</li>
          </ul>
        </li>

        <li>
          <strong>Right to Restrict Processing (Art. 18):</strong>
          <ul>
            <li>There is no in-app toggle to suspend voluntary data processing. If you want us to stop collecting
              voluntary data, simply do not save any new entries. Each time you log in without saving new voluntary
              data, you will be prompted to enter today's weight. If you decline, no new voluntary data is collected.
              For additional requests, email <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a>.</li>
          </ul>
        </li>

        <li>
          <strong>Right to Data Portability (Art. 20):</strong>
          <ul>
            <li>To receive your data in JSON format, email us at <a
                href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a>. We will respond within one year of your
              request.</li>
          </ul>
        </li>

        <li>
          <strong>Right to Object (Art. 21):</strong>
          <ul>
            <li>We do not perform any analytics or profiling on user data beyond standard server logs. If you wish to
              object to any future analytics, email <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a>.
            </li>
          </ul>
        </li>

        <li>
          <strong>Right to Withdraw Consent (Art. 7(3)):</strong>
          <ul>
            <li>For any voluntary data you have saved, you may edit or delete entries in-app. To cease processing
              entirely, delete your account. All voluntary data will be removed immediately upon successful deletion.
            </li>
          </ul>
        </li>

        <li>
          <strong>Right to Lodge a Complaint (Art. 77):</strong>
          <ul>
            <li>If you believe our processing violates GDPR, you may contact your local supervisory authority or email
              <a href="mailto:jl225vf@student.lnu.se">jl225vf@student.lnu.se</a> first. We will attempt to address your
              concern.</li>
          </ul>
        </li>
      </ul>

      <!-- 5.5 Retention & Deletion -->
      <h4>5.5 Retention &amp; Deletion</h4>
      <ul>
        <li>
          <strong>Server 1 (Required Data: email, password hash, date of birth):</strong>
          <ul>
            <li>Deleted immediately upon successful use of the Delete Account form.</li>
          </ul>
        </li>
        <li>
          <strong>Server 2 (Voluntary Data: height, weight history, activity level, meal logs, etc.):</strong>
          <ul>
            <li>Deleted immediately upon successful use of the Delete Account form.</li>
            <li>No inactivity-based purging is implemented.</li>
          </ul>
        </li>
      </ul>

      <!-- 5.6 Data Protection Impact Assessment (DPIA) -->
      <h4>5.6 Data Protection Impact Assessment (DPIA)</h4>
      <p>
        We process height, weight, and meal logs as “health data.” To mitigate re-identification, we separate Server 1
        and Server 2, limit access to a single developer, and use HTTPS. Residual risk is low. We revisit this DPIA
        annually.
      </p>

      <!-- 5.7 Changes to GDPR & Data Protection Terms -->
      <h4>5.7 Changes to GDPR &amp; Data Protection Terms</h4>
      <p>
        This is a student project, and updates may be infrequent. If we revise these terms, we will post the updated
        version in-app. No additional notification (such as email) is guaranteed.
      </p>
    </details>

    <!-- 6. Acceptance of Risk -->
    <details>
      <summary>6. Acceptance of Risk</summary>
      <p>
        By using this app, you acknowledge the above disclaimers and agree to use the application at your own risk.
      </p>
    </details>
  </section>
</template>




<style scoped>
.p-drawer-header {
  /* padding: 0.25rem !important; */
  padding: 0.5rem 1rem !important;
}

details {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--grey-300);
  border-radius: 5px;
  background-color: var(--grey-100);
}


summary {
  font-weight: bold;
  cursor: pointer;
  outline: none;
  margin-bottom: 0.75rem;
}

summary::-webkit-details-marker {
  display: none;
}

details[open] summary {
  color: var(--primary-900);
}

p {
  margin: 0.5rem 0;
  line-height: 1.5;
}


h4,
h5 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}


ul {
  margin: 0.75rem 0;
  padding-left: 1.25rem;
}

li {
  margin-bottom: 0.5rem;
}

ul ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

details:last-of-type {
  margin-bottom: 2rem;
}

details details {
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
}
</style>
