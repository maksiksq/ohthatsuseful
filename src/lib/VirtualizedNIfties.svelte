<script lang="ts">
    const {nifties, focusedNift, handleFocus} = $props();

    const cardsPerRow = $state(4);

    const remToPx = (rem: number) => parseFloat(getComputedStyle(document.documentElement).fontSize) * rem;;

    let containerElem = $state<HTMLElement | null>(null);
    // TODO: use a probe card instead
    // note: Svelte doesn't really allow to bind:this conditionally for some reason
    // so I'm just using the rect of the last element (default for :this bindings), they're the same anyway
    // only installing an observer on one so should be aight
    let cardWrapElem = $state<HTMLElement | null>(null);
    let cardWrapRect = $state<DOMRect | null>(null);
    const rowHeight = $derived.by(() => {
        console.log("hello")
        if (!cardWrapRect) return;
        if (!cardWrapRect.height) return;

        return cardWrapRect.height + remToPx(1);
    });
    $effect(() => {
        console.log(cardWrapElem)
        if (!cardWrapElem) return;

        const observer = new ResizeObserver(() => {
            if (!cardWrapElem) return;
            cardWrapRect = cardWrapElem.getBoundingClientRect();
            console.log("cardWrapRect", cardWrapRect);
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
        // console.log("scrolltop", scrollTop)
    }

    const rowsPerScreen = $derived.by(() => {
        if (!rowHeight) return;
        return Math.ceil(viewportHeight / rowHeight);
    });

    let startRow = $derived.by(() => {
        if (!rowHeight) return;
        console.log("rowHeight", rowHeight)
        if (scrollTop < 0) return 0;
        console.log("scrollTop", scrollTop)
        return Math.floor(scrollTop / rowHeight);
    });

    let endRow = $derived.by(() => {
        console.log("rowHeight", rowHeight)
        console.log("startRow", startRow)
        console.log("rowsPerScreen", rowsPerScreen)
        if (rowHeight == null || startRow == null || rowsPerScreen == null) return;
        console.log("startRow + rowsPerScreen", startRow + rowsPerScreen)
        return startRow + rowsPerScreen;
    });

    const visibleCards = $derived.by(() => {
        console.log('hia')
        console.log(rowHeight)
        console.log("startRow", startRow)
        console.log("endRow", endRow)
        if (rowHeight == null || startRow == null || endRow == null) return;
        console.log('hiaa')

        return nifties.slice(startRow * cardsPerRow, endRow * cardsPerRow);
    })



    $inspect(visibleCards);
</script>

<svelte:window onscroll={updateViewport} onresize={updateViewport} />

<div bind:this={containerElem} class="content-cards">
    <!--dummy elem so we know the height-->
    <div bind:this={cardWrapElem} class="card-wrapper dummy" aria-hidden="true">
        <div class="card">
            <div class="h2-wrap">
                <h2 title="Dummy">Dummy</h2>
            </div>
            <div class="card-info">
                <p class="card-info-favicon-wrap">
                    <img class="card-info-favicon" src="" alt="">
                </p>
                <div class="card-info-title-wrap">
                    <p class="card-info-title">Dummy</p>
                </div>
                <a class="card-info-link" href="/" target="_blank" rel="noopener">🔗</a>
            </div>
            <p class="card-screenshot-link-wrap">
                <img class="card-screenshot" src="" alt="">
            </p>
        </div>
    </div>

    {#each new Array(18) as i}
    {#each visibleCards as nift, i (nift.id)}
        <div class="card-wrapper">
            <div role="button" tabindex="0"
                 class={`card ${(focusedNift?.title === nift.title) ? 'focused' : ''}`}
                 onclick={(e) => {handleFocus(e, nift)}} onkeydown={(e) => {handleFocus(e, nift)}}>
                <div class="h2-wrap">
                    <h2 title={nift.display_name}>{nift.display_name}</h2>
                </div>
                <div class="card-info">
                    <p class="card-info-favicon-wrap">
                        <img class="card-info-favicon" loading="lazy" src={nift.favicon} alt={`${nift.name} favicon`}>
                    </p>
                    <div class="card-info-title-wrap">
                        <p class="card-info-title">{nift.title}</p>
                    </div>
                    <a class="card-info-link" href={nift.link} target="_blank" rel="noopener">🔗</a>
                </div>
                <p class="card-screenshot-link-wrap">
                    <img class="card-screenshot" loading="lazy" src={nift.screenshot} alt={nift.name}>
                </p>
            </div>
        </div>
    {/each}
    {/each}
</div>

<style>
    .dummy {
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
                        user-select: none;
                    }
                }
            }
        }
    }
</style>