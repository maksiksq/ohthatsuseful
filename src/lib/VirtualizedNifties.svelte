<script lang="ts">
    import {onMount} from "svelte";
    import {flip} from "svelte/animate"
    import Card from "$lib/Card.svelte";

    const {nifties, focusedNift, handleFocus, cardsPerRow} = $props();

    const remToPx = (rem: number) => parseFloat(getComputedStyle(document.documentElement).fontSize) * rem;

    let containerElem = $state<HTMLElement | null>(null);
    let cardWrapElem = $state<HTMLElement | null>(null);
    let cardWrapRect = $state<DOMRect | null>(null);
    const rowHeight = $derived.by(() => {
        if (!cardWrapRect) return 380;
        if (!cardWrapRect.height) return 380;

        return cardWrapRect.height + remToPx(1);
    });
    $effect(() => {
        if (!cardWrapElem) return;

        const observer = new ResizeObserver(() => {
            if (!cardWrapElem) return;
            cardWrapRect = cardWrapElem.getBoundingClientRect();
        })

        observer.observe(cardWrapElem);

        return () => {
            observer.disconnect();
        }
    })

    let viewportHeight = $state(0);
    let scrollTop = $state(0);
    const updateViewport = () => {
        viewportHeight = window.innerHeight;
        if (!containerElem) return;
        scrollTop = window.scrollY - containerElem.offsetTop;
    }

    onMount(() => {
        updateViewport();
    })

    const rowsPerScreen = $derived.by(() => {
        if (!rowHeight) return;
        return Math.ceil(viewportHeight / rowHeight);
    });

    let startRow = $derived.by(() => {
        if (!rowHeight) return 0;
        if (scrollTop < 0) return 0;
        return Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
    });

    let endRow = $derived.by(() => {
        if (rowHeight == null || startRow == null || rowsPerScreen == null) return 2;
        return startRow + rowsPerScreen + 2;
    });

    const visibleCards = $derived.by(() => {
        if (rowHeight == null || startRow == null || endRow == null || nifties.length === 0) return;

        return nifties.slice(startRow * cardsPerRow, endRow * cardsPerRow);
    })

    const dummyNift = {
        title: "Dummy",
        display_name: "Dummy",
        link: "#",
        favicon: nifties[0].favicon,
        screenshot_smol: nifties[0].screenshot_smol,
    }
</script>

<svelte:window onscroll={updateViewport} onresize={updateViewport}/>

{#if nifties.length > 0 && visibleCards}
    <div bind:this={containerElem} class="content-cards">
        <!--dummy elem so we know the height-->
        <div bind:this={cardWrapElem} class="card-wrapper dummy" aria-hidden="true">
            <div class="card">
                <Card nift={dummyNift} focusedNift handleFocus/>
            </div>
        </div>

        <!--top spacer-->
        <div style="flex-basis:100%; height:{startRow * rowHeight}px;"></div>

        <!--make sure it's not in a parent from which is can calculate its position or offsetTop dies-->
        {#each visibleCards as nift (nift.id)}
            <div animate:flip={{ duration: 100, delay: 100 }} class="card-wrapper">
                <Card {nift} {focusedNift} {handleFocus} />
            </div>
        {/each}

        <!--bottom spacer-->
        <div style="flex-basis:100%; height:{Math.max(0, Math.ceil(nifties.length / cardsPerRow) * rowHeight - endRow * rowHeight)}px;"></div>
    </div>
{:else}
    {@const honk = Math.floor(Math.random() * 3) === 0}
    <div class="no-results-seg">
        {#if honk}
            <img src="/img/bootlegcellshadedgoosewsmokingpipeexcepthonk.webp" title="yes, i photoshopped a pipe to a goose" alt="A goose except i photoshopped a pipe in">
        {:else}
            <img src="/img/bootlegcellshadedgoosewsmokingpipe3.webp" title="yes, i photoshopped a pipe to a goose" alt="A goose except i photoshopped a pipe in">
        {/if}
        <p>Our scout geese have not found what you requested.</p>
        <p>Try a different query or shuffling some tags.</p>
    </div>
{/if}

<style>
    .no-results-seg {
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & img {
            margin-top: 2rem;
            user-select: none;
            width: 10vw;
        }

        & p {
            margin-top: 1rem;
            font-size: 1.2rem;
            font-weight: 400;
            text-align: center;
        }
    }

    .dummy {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    .content-cards {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: flex-start;
        row-gap: 1rem;

        box-sizing: border-box;
        padding: 0 2rem 0 2rem;

        @media (max-width: 569px) {
            padding: 0 0.1rem 0 0.1rem;
        }

        & .card-wrapper {
            flex: 1 1 25%;
            max-width: 25%;
            display: flex;
            box-sizing: border-box;
            font-weight: 400;
            padding: 0.3rem;

            cursor: pointer;

            @media (max-width: 769px) {
                flex: 1 1 33.33%;
                max-width: 33.33%;
            }

            @media (max-width: 569px) {
                flex: 1 1 100%;
                max-width: 100%;
            }

            /* more inside Card.svelte */
        }
    }
</style>