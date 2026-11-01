<script lang="ts">
  import { onMount } from "svelte";
  import { checkAuth, logout, userStore } from "../js/auth.svelte";

  const baseURL =
    import.meta.env.PUBLIC_SERVER_URL ?? "http://localhost:3000/api/v1/";
  type ProfileResponse = {
    message: string;
  };

  let profile = $state<ProfileResponse | null>(null);
  let errorMessage = $state("");

  async function getProfile(): Promise<ProfileResponse | null> {
    try {
      const response = await fetch(`${baseURL}users/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      if (!response.ok) {
        logout();
        window.location.href = `/login/?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
        return null;
      }

      return (await response.json()) as ProfileResponse;
    } catch {
      errorMessage = "Unable to load your profile.";
      return null;
    }
  }

  async function init() {
    if (await checkAuth()) {
      profile = await getProfile();
    } else {
      const returnPath = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login/?redirect=${encodeURIComponent(returnPath)}`;
    }
  }

  onMount(init);
</script>

{#if userStore.isLoggedIn && profile}
  <p>{profile.message}</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <p>You must log in to see this page.</p>
{/if}