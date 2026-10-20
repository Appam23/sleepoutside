<script lang="ts">
  import { onMount } from "svelte";

  let visible = $state(false);

  function openUserMenu(event: MouseEvent) {
    event.stopPropagation();
    visible = !visible;
  }

  function closeMenu() {
    visible = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  onMount(() => {
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
  </button>

  <nav class="user__menu" class:open={visible}>
    <a href="#">Login</a>
    <a href="#">Profile</a>
    <a href="#">Orders</a>
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
</style>