<script lang="ts">
    import {enhance} from '$app/forms';
    import Card from "$lib/Card.svelte";
    import {goto} from "$app/navigation";
    import Focus from "$lib/Focus.svelte";

    let {form} = $props();

    let link = $state('');
    $effect(() => {
        if (form?.data) {
            link = form.data.link;
        }
    })
    let display_name = $state('');
    let comment = $state('');
    let warning = $state('');
    let copyright = $state('');
    let custom = $state('');
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
            comment,
            warning,
            copyright,
            tags
        };
    });

    // most of this kinda dependent on the main logic in routes/+page.svelte

    let focus = $state(false);
    let focusedNift = $derived(form?.data);
    let focusedNiftTags = $derived(focusedNift?.tags);
    let bodyElem = $state<HTMLElement | null>(null);

    let isFocusLeft = $state(true);
    let focusButtonSeg = $state(1);
    const handleFocus = (e: Event, nift: typeof focusedNift) => {
        focus = true;
        focusedNift = nift;
        let elem = e.target as HTMLElement | null;
        if (!elem) return;
        const rect = elem.getBoundingClientRect();

        // if it's the link (clickable) let's just pretend it was the wrapper
        if (elem.classList.contains('card-info-link')) {
            elem = elem.closest('.card-wrapper') as HTMLElement | null;
            if (!elem) return;
        }

        // scrolling with the element in the middle
        const elemBottom = rect.bottom + window.scrollY - window.innerHeight;
        const scrollToY = elemBottom + window.innerHeight / 2.4 - elem.offsetHeight / 2;
        scrollTo({top: scrollToY, behavior: 'smooth'});

        // checking if it's leave or right and applying styles appropriately
        const elemRight = rect.right;
        const elemCenter = rect.left + rect.width / 2;
        isFocusLeft = elemRight > window.innerWidth / 2;

        focusButtonSeg = Math.ceil(elemCenter/(window.innerWidth/4));

        if (!bodyElem) return;
        document.documentElement.classList.add('scroll-lock');
    }


    let descElem: HTMLElement | null = $state(null);
    const handleUnfocus = (e: Event) => {
        const target = e.target as HTMLElement;
        if ((!descElem?.contains(target) || target.classList.contains("desc")) && !target.classList.contains("card") && !target.classList.contains("visit")) {
            focus = false;

            // fading out in 200 ms to prevent looking like a sudden unselection
            setTimeout(() => {
                focusedNift = null;
            }, 200)

            // timeout so the animation goes away to prevent a visible layout shift
            setTimeout(() => {
                if (!bodyElem) return;
                if (focus) return;
                document.documentElement.classList.remove('scroll-lock');
            }, 400);
        }
    }

    // Handle travel to the main page
    // lost a bit of text when typing goose lmao, thus the slashes
    const cheatCode = ['/', '/', '/', '/', 'G', 'O', 'O', 'S', 'E'];
    let codeIx = 0;
    const maxDelay = 3000;
    let past = Date.now();

    const handleCheatCode = (e: KeyboardEvent) => {
        const now = Date.now();

        if (now - past > maxDelay) {
            codeIx = 0;
        }

        past = now;

        if (e.key === cheatCode[codeIx] || e.key === cheatCode[codeIx].toLowerCase()) {
            codeIx++;
            if (codeIx === cheatCode.length) {
                goto('/');
                codeIx = 0;
            }
        } else {
            codeIx = 0;
        }
    }
</script>


<svelte:window onclick={focus ? (e) => {handleUnfocus(e)} : () => {}} onkeydown={(e) => {handleCheatCode(e);}}/>
<svelte:body bind:this={bodyElem}/>

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
            <label> Comment:
                <input type="text" name="comment" bind:value={comment} placeholder="Comment...">
            </label>
            <label> Warning:
                <input type="text" name="warning" bind:value={warning} placeholder="Warning...">
            </label>
            <label> Copyright:
                <input type="text" name="copyright" bind:value={copyright} placeholder="Copyright...">
            </label>
            <label> Custom HTML:
                <input type="text" name="customHtml" bind:value={custom} placeholder="Custom...">
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
                <Card nift={previewData} focusedNift={previewData} {handleFocus}/>
            </div>
        {/if}
    </div>
</main>
<div class="goose-fly">
    <img src="/img/peace-goose.webp" alt="goose">
</div>
{#if focus && focusedNift}
    <Focus bind:descElem {focusedNift} {handleUnfocus} {isFocusLeft} {focusedNiftTags} {focusButtonSeg}  />
{/if}
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