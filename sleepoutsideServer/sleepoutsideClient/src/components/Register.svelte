<script lang="ts">
  import { register } from "../js/auth.svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let errorMessage = $state("");
  let isSubmitting = $state(false);
  let isRegistered = $state(false);

  async function registerHandler(event: SubmitEvent) {
    event.preventDefault();
    errorMessage = "";

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
      return;
    }

    isSubmitting = true;

    try {
      await register(name, email, password);
      isRegistered = true;
      window.location.href = "/login/?redirect=/";
    } catch (error) {
      errorMessage =
        error instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="register" aria-labelledby="register-title">
  <h1 id="register-title">Create an account</h1>

  {#if isRegistered}
    <p class="success" role="status">Account created. You can now log in.</p>
  {:else}
    <form onsubmit={registerHandler}>
      <label for="name">Name</label>
      <input id="name" name="name" autocomplete="name" bind:value={name} required />

      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        bind:value={email}
        required
      />

      <label for="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="new-password"
        minlength="6"
        bind:value={password}
        required
      />

      <label for="confirm-password">Confirm password</label>
      <input
        id="confirm-password"
        name="confirm-password"
        type="password"
        autocomplete="new-password"
        minlength="6"
        bind:value={confirmPassword}
        required
      />

      {#if errorMessage}
        <p class="error" role="alert">{errorMessage}</p>
      {/if}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>

    <p>Already have an account? <a href="/login/">Log in</a></p>
  {/if}
</section>

<style>
  .register {
    max-width: 32rem;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid var(--light-grey);
  }

  h1 {
    margin-top: 0;
  }

  form {
    display: grid;
    gap: 0.6rem;
  }

  input {
    width: 100%;
    padding: 0.6rem;
    font: inherit;
    border: 1px solid var(--light-grey);
  }

  button {
    margin-top: 0.8rem;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .error {
    color: #a00000;
  }

  .success {
    color: var(--secondary-color);
  }
</style>
