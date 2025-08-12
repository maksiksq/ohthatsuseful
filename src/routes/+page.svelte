<script lang="ts">
const { data } = $props();

const sendkey = async () => {
    const response = await fetch('/api/v1/screenshots', {
        method: 'POST',
        body: 'failure.',
        headers: {
            'authorization': `Bearer wrongle`
        }
    });
};
</script>
<main>
    <h1>Oh that's useful</h1>
    {#each data.nifties as nift (nift.id)}
    <div class="card">
        I'm a card
        hi
        <a href={nift.link}>🔗 link</a>
        <p>{nift.comment}</p>
        <img src="https://placehold.it/100x100.jpg" alt="placeholder">
        <button onclick={sendkey}>a</button>
    </div>
    {/each}
</main>

<style>

</style>