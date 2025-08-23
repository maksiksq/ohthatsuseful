<script lang="ts">
    import {onMount} from "svelte";
    import {fade, fly, blur} from "svelte/transition"

    const {nifties, focusedNift, handleFocus} = $props();

    const cardsPerRow = $state(4);

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
</script>

<svelte:window onscroll={updateViewport} onresize={updateViewport}/>

{#if nifties.length > 0 && visibleCards}
    <div bind:this={containerElem} class="content-cards">
        <!--dummy elem so we know the height-->
        <div bind:this={cardWrapElem} class="card-wrapper dummy" aria-hidden="true">
            <div class="card">
                <div class="h2-wrap">
                    <h2 title="Dummy">Dummy</h2>
                </div>
                <div class="card-info">
                    <p class="card-info-favicon-wrap">
                        <img class="card-info-favicon" src={nifties[0].favicon} alt="">
                    </p>
                    <div class="card-info-title-wrap">
                        <p class="card-info-title">Dummy</p>
                    </div>
                    <a class="card-info-link" href="/" target="_blank" rel="noopener">🔗</a>
                </div>
                <p class="card-screenshot-link-wrap">
                    <img class="card-screenshot" src={nifties[0].screenshot_smol} width="600" height="337" alt="">
                </p>
            </div>
        </div>

        <!--top spacer-->
        <div style="flex-basis:100%; height:{startRow * rowHeight}px;"></div>

        <!--make sure it's not in a parent from which is can calculate its position or offsetTop dies-->
        {#each visibleCards as nift (nift.id)}
            <div transition:blur={{duration: 100}} class="card-wrapper">
                <div role="button" tabindex="0"
                     class={`card ${(focusedNift?.title === nift.title) ? 'focused' : ''}`}
                     onclick={(e) => {handleFocus(e, nift)}} onkeydown={(e) => {handleFocus(e, nift)}}>
                    <div class="h2-wrap">
                        <h2 title={nift.display_name}>{nift.display_name}</h2>
                    </div>
                    <div class="card-info">
                        <p class="card-info-favicon-wrap">
                            <img class="card-info-favicon" loading="lazy" src={nift.favicon}
                                 alt={`${nift.name} favicon`}>
                        </p>
                        <div class="card-info-title-wrap">
                            <p class="card-info-title">{nift.title}</p>
                        </div>
                        <a class="card-info-link" href={nift.link} target="_blank" rel="noopener">🔗</a>
                    </div>
                    <p class="card-screenshot-link-wrap">
                        <img class="card-screenshot" loading="lazy" src={nift.screenshot_smol} width="600" height="337"
                             alt={nift.name}>
                    </p>
                </div>
            </div>
        {/each}

        <!--bottom spacer-->
        <div style="flex-basis:100%; height:{Math.max(0, Math.ceil(nifties.length / cardsPerRow) * rowHeight - endRow * rowHeight)}px;"></div>
    </div>
{:else}
    no results 4 u;
{/if}

<style>
    .dummy {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    .focused {
        position: relative;
        z-index: 1002;

        /* notice that it's not a border because layout shift */
        outline: 1px solid #151515 !important;
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

        & .card-wrapper {
            flex: 1 1 25%;
            max-width: 25%;
            display: flex;
            box-sizing: border-box;
            font-weight: 400;
            padding: 0.3rem;

            cursor: pointer;

            & .card {
                display: flex;
                flex-direction: column;
                height: 100%;

                box-sizing: border-box;

                padding: 1rem 1rem;

                word-break: break-word;
                overflow-wrap: anywhere;

                background-color: white;
                border-radius: 3px;
                border: 1px solid #151515;

                box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 25%), 0 5px 0 1px rgba(0, 0, 0, 15%);

                * {
                    pointer-events: none;
                }

                &:hover {
                    /* notice that it's not a border because layout shift */
                    outline: 1px solid #151515;
                }

                & .h2-wrap {
                    display: flex;
                    align-items: center;
                    line-height: 1.2em;
                    height: 2.4em;
                    margin-top: 1rem;

                    & h2 {
                        font-size: 1.5rem;
                        line-height: 1.2em;
                        font-weight: 400;

                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;

                        user-select: none;
                    }
                }

                & .card-info {
                    padding-left: 0.3rem;
                    padding-top: 1.3rem;
                    padding-bottom: 0.3rem;
                    gap: 0.65rem;
                    display: flex;
                    align-items: center;

                    & .card-info-link {
                        margin-left: auto;
                        pointer-events: initial;
                        user-select: none;
                    }

                    & .card-info-favicon-wrap {
                        display: flex;
                        align-items: center;

                        & .card-info-favicon {
                            aspect-ratio: 1/1;
                            width: 1rem;
                            height: 1rem;
                            user-select: none;
                        }
                    }

                    & .card-info-title-wrap {
                        display: flex;
                        align-items: center;
                        line-height: 1em;
                        height: 2em;

                        & .card-info-title {
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;

                            user-select: none;
                        }
                    }

                    & .h2-wrap {
                        display: flex;
                        align-items: center;
                        line-height: 1.2em;
                        height: 2.4em;
                        margin-top: 1rem;

                        & h2 {
                            font-size: 1.5rem;
                            line-height: 1.2em;
                            font-weight: 400;

                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    }
                }

                & .card-screenshot-link-wrap {
                    border-top: 1px solid #151515;
                    padding-top: 0.9rem;

                    & .card-screenshot {
                        border: 1px solid #151515;
                        width: 100%;
                        height: auto;
                        user-select: none;
                    }
                }
            }
        }
    }
</style>