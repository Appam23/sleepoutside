<script lang="ts">
  import { onMount } from "svelte";
  import { login } from "../js/auth.svelte";

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let isSubmitting = $state(false);
  let isLoggedIn = $state(false);
  let redirectPath = "/";

  onMount(() => {
    const param = new URLSearchParams(window.location.search).get("redirect");

    if (param?.startsWith("/") && !param.startsWith("//")) {
      redirectPath = param;
      return;
    }

    if (document.referrer && document.referrer !== window.location.href) {
      const referrer = new URL(document.referrer);

      if (referrer.origin === window.location.origin) {
        redirectPath = `${referrer.pathname}${referrer.search}${referrer.hash}`;
      }
    }
  });

  async function loginHandler(event: SubmitEvent) {
    event.preventDefault();
    errorMessage = "";
    isSubmitting = true;

    try {
      await login(email, password);
      isLoggedIn = true;
      password = "";
      window.location.href = redirectPath;
    } catch (error) {
      errorMessage =
        error instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : error instanceof Error
            ? error.message
            : "Unable to log in. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="login" aria-labelledby="login-title">
  <h1 id="login-title">Log in</h1>

  {#if isLoggedIn}
    <p class="success" role="status">You are logged in.</p>
  {:else}
    <form onsubmit={loginHandler}>
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
        autocomplete="current-password"
        bind:value={password}
        required
      />

      {#if errorMessage}
        <p class="error" role="alert">{errorMessage}</p>
      {/if}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>

    <p>Need an account? <a href="/register/">Create one</a></p>
  {/if}
</section>

<style>
  .login {
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
