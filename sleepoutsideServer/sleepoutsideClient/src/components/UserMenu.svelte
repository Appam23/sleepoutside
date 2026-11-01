<script lang="ts">
  import { onMount } from "svelte";
  import { checkAuth, logout, userStore } from "../js/auth.svelte";

  let visible = $state(false);

  function openUserMenu(event: MouseEvent) {
    event.stopPropagation();
    visible = !visible;
  }

  function closeMenu() {
    visible = false;
  }

  function handleLogout() {
    logout();
    closeMenu();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  onMount(async () => {
    await checkAuth();
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="user">
  <button
    type="button"
    class="user__button"
    aria-label="user management"
    aria-expanded={visible}
    title="User Management"
    onclick={openUserMenu}
  >
    <img src="/images/noun-hiker.svg" alt="user icon" />
    {#if userStore.isLoggedIn && userStore.user}
      <span class="user__name">{userStore.user.name}</span>
    {/if}
  </button>

  <nav class="user__menu" class:open={visible}>
    {#if userStore.isLoggedIn}
      <button type="button" onclick={handleLogout}>Logout</button>
      <a href="/orders/">Orders</a>

    {:else}
      <a href="/login/">Login</a>
      <a href="/register/">Register</a>
    {/if}
     <a href="/profile/">Profile</a>
  </nav>
</div>

<style>
  .user {
    position: relative;
    display: flex;
    align-items: flex-end;
  }

  .user__menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
  }

  .user__name {
    margin-top: -1.0rem;
    line-height: 1;
    font-size: 0.8rem;
    white-space: nowrap;
  }
  .user__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    min-width: 40px;
    height: auto;
    overflow: visible;
  }

  .user__button img {
    display: block;
    width: 58px;
    height: 68px;
    max-width: none;
  }
  .user__menu button {
    margin: 0;
    padding: 0;
    background: transparent;
    color: var(--dark-grey);
    font: inherit;
  }

</style>