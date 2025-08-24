<script lang="ts">
    import {enhance} from '$app/forms';
    import Card from "$lib/Card.svelte";

    let {form} = $props();

    let link = $state('');
    $effect(() => {
        if (form?.data) {
            link = form.data.link;
        }
    })
    let display_name = $state('');
    let what_tags = $state('');
    let which_tags = $state('');
    let why_tags = $state('');
    let tags = $derived.by(() => ({
        what: what_tags.split(",").map(s => s.trim()),
        which: which_tags.split(",").map(s => s.trim()),
        why: why_tags.split(",").map(s => s.trim())
    }));

    const previewData = $derived.by(() => {
        return {
            ...(form?.data ?? {}),
            link,
            display_name,
            tags
        };
    });

    // TODO: make real?
    const dummyHandleFocus = () => {
        console.log("grass");
    }
</script>

<main>
    <div class="input-seg">
        <p>Very official secret lair.</p>
        <p>You heard of a shrimp but have you heard of a shrip?</p>
        <h3>Add a card: </h3>
        <form method="POST" action="?/add" use:enhance>
            <label> Link:
                <input type="text" name="link" bind:value={link} placeholder="Link...">
            </label>
            <button formaction="?/preview">Get Preview</button>
            <label> Display name:
                <input type="text" name="displayName" bind:value={display_name} placeholder="Display name...">
            </label>
            <label> What tags:
                <input type="text" name="whatTags" bind:value={what_tags} placeholder="What tags...">
            </label>
            <label> Which tags:
                <input type="text" name="whichTags" bind:value={which_tags} placeholder="Which tags...">
            </label>
            <label> Why tags:
                <input type="text" name="whyTags" bind:value={why_tags} placeholder="Why tags...">
            </label>
            <button>Add entry</button>
        </form>

        {#if form?.threat}
            <p>{form?.threat}</p>
        {/if}
    </div>
    <div class="card-seg">
        {#if previewData}
            <div class="card-wrapper">
                <Card nift={previewData} focusedNift={previewData} handleFocus={dummyHandleFocus}/>
            </div>
        {/if}
    </div>
</main>
<div class="goose-fly">
    <img src="/img/peace-goose.webp" alt="goose">
</div>
<style>
    .goose-fly {
        position: fixed;
        right: 0;
        top: 0;
        transform: translateX(50%);
        opacity: 0.8;
        z-index: 0;

        & img {
            width: 16rem;
            height: auto;
        }
    }

    main {
        display: flex;
        background-color: #d6fff1;

        & .input-seg {
            width: 50%;

            box-sizing: border-box;
            padding: 5rem 2rem;

            display: flex;
            flex-direction: column;
            justify-content: center;

            & form {
                display: flex;
                flex-direction: column;

                & label {
                    margin-top: 0.2rem;
                    width: 9rem;
                }

                & input {
                    width: 10rem;
                    padding: 0.2rem;
                }

                & button {
                    background-color: #151515;
                    border-radius: 1px;
                    border: 1px solid black;
                    width: 8rem;
                    padding: 0.2rem 1rem;
                    color: white;
                    margin: 2rem 0.5rem 0.5rem 0;
                }
            }
        }

        & .card-seg {
            width: 50%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;

            & .card-wrapper {
                max-width: 25vw;
                display: flex;
                box-sizing: border-box;
                font-weight: 400;
                padding: 0.3rem;

                cursor: pointer;

                /* more inside Card.svelte */
            }
        }
    }


</style>