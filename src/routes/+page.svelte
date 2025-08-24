<script lang="ts">
    import TagSeg from "./TagSeg.svelte";
    import confetti from "canvas-confetti";
    import {enhance} from "$app/forms";
    import {onMount} from "svelte";
    import Footer from "$lib/Footer.svelte";
    import VirtualizedNifties from "$lib/VirtualizedNifties.svelte";
    import Fuse from "fuse.js";
    import {goto} from "$app/navigation";
    import Focus from "$lib/Focus.svelte";

    const {data} = $props();

    let devOverlay = $state(false);
    const summonDevOverlay = (e: KeyboardEvent) => {
        if (e.key === 'o') {
            devOverlay = !devOverlay;
        }
    };

    // search
    let query = $state('');
    let selectedTags = $state<Array<string>>([]);

    const fuse = new Fuse(data.nifties, {
        keys: [
            { name: 'link', weight: 0.05 },
            { name: 'comment', weight: 0.15 },
            { name: 'metadesc', weight: 0.1 },
            { name: 'display_name', weight: 0.2 },
            { name: 'title', weight: 0.4 },
            { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.45
    });

    let searchedNifties = $state(data.nifties);

    const hasTags = (item: typeof data.nifties[number], selectedTags: string[]) => {
        return selectedTags.length === 0 || selectedTags.some(tag =>
            Object.values(item.tags).some(arr => arr.includes(tag))
        );
    };

    let timeout: ReturnType<typeof setTimeout>;
    $effect(() => {
        // reactivity
        const q = query;
        const s = selectedTags;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            if (!q && s.length === 0) {
                searchedNifties = data.nifties;
            } else if (!q) {
                searchedNifties = data.nifties.filter(item => hasTags(item, s));
            } else {
                searchedNifties = fuse.search(q)
                    .map(r => r.item)
                    .filter(item => hasTags(item, s));
            }
        }, 150);
    });


    // wowiews
    let wowie = $state('neat')

    const wowies =
        [
            "neat",
            "cool",
            "sh*t",
            "wowie",
            "wowza",
            "snap",
            "hell",
            "woah",
            "damn",
            "well",
            "greg",
            "holy",
            "shucks",
            "rats",
            "sheesh",
            "yeet",
            "bananas",
            "toast",
            "yikes",
            "alas",
            "yes",
            "sweet",
            "gee",
            "gosh",
            "bless",
            "my",
            "goodness",
            "crumbs",
            "mercy",
            "zoinks",
            "yippee",
            "boy",
            "la-la",
            "booyah",
            "crisp",
            "wicked",
            "sleek",
            "hai",
            "gremlin",
            "poppies",
            "hey",
            "grass",
            "slug",
            "heavens",
            "dangit",
            "yowza",
            "derp",
            "heckin",
            "zesty",
            "shiny",
            "dandy",
            "juices",
            "bling",
            "scoundrel",
            "blast",
            "bonkers",
        ]

    // Easter egg (cursed)
    let rotationCount = $state(0);
    let discovered = $state(new Set<string>());
    let discoveredCount = $derived(discovered.size);
    let addiction = $state(false);
    const rotateWowies = (manually = false) => {
        if (wowiesInterval) clearInterval(wowiesInterval);
        const rotate = () => wowie = wowies[Math.floor(Math.random() * wowies.length)];
        rotationCount += 1;
        discovered = new Set(discovered).add(wowie);
        if (manually) rotate();
        wowiesInterval = setInterval(() => rotate(), 10000)
        if (rotationCount > 25) addiction = true;
    }

    let wowiesInterval: ReturnType<typeof setInterval>
    onMount(() => {
        rotateWowies();
    })

    let congratulations = $state(false);
    $effect(() => {
        if (discoveredCount.toString() === wowies.length.toString()) {
            congratulations = true;
            confetti();
        }
    })

    //

    let focus = $state(false);
    let focusedNift = $state<typeof data.nifties[number]>();
    let focusedNiftTags = $derived<typeof data.tags>(focusedNift?.tags);
    let bodyElem = $state<HTMLElement | null>(null);

    let isFocusLeft = $state(true);
    let focusButtonSeg = $state(1);
    const handleFocus = (e: Event, nift: typeof data.nifties[number]) => {
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

    // Handle travel to the admin page
    const cheatCode = ['G', 'O', 'O', 'S', 'E'];
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
                goto('/admin');
                codeIx = 0;
            }
        } else {
            codeIx = 0;
        }
    }
</script>


<svelte:window onclick={focus ? (e) => {handleUnfocus(e)} : () => {}} onkeydown={(e) => {summonDevOverlay(e); handleCheatCode(e);}}/>
<svelte:body bind:this={bodyElem}/>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com"/>
</svelte:head>

<!-- dev only -->
<div class={`dev-overlay ${devOverlay ? '' : 'd-none'}`}>
    <form method="POST" action="?/testApiUpdateAll" use:enhance>
        <button type="submit">Update All (REEEEE)</button>
    </form>
    <form method="POST" action="?/testApiUpdateSpecific" use:enhance>
        <button type="submit">Update Specific (REEE)</button>
    </form>
</div>
<!-- -->
<main class="home-main">
    <section class="h1-seg">
        {#if addiction}
            <div class="addiction">
                <p>{congratulations ? "🎉🎉🎉" : `Congratulations, on your newly found gambling addiction! ${discoveredCount}/${wowies.length}`}</p>
                <canvas id="confetti-canvas"></canvas>
            </div>
        {/if}
        <h1><span>oh</span> <span class="wowie" role="button" tabindex="-1" onclick={() => rotateWowies(true)}
                     onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter') rotateWowies(true)}}>{wowie}</span><span>,</span><br>
            <span>that's</span> <span>useful</span></h1>
    </section>
    <TagSeg tags={data.tags} bind:query={query} bind:selectedTags={selectedTags}/>
    <section class="content-seg">
        <VirtualizedNifties nifties={searchedNifties} {focusedNift} {handleFocus}/>
    </section>
</main>
{#if focus && focusedNift}
    <Focus bind:descElem {focusedNift} {handleUnfocus} {isFocusLeft} {focusedNiftTags} {focusButtonSeg}  />
{/if}
<Footer fromContact={false}/>

<!-- just caching the image here to prevent layout flicker when clicking on a card -->
<img src="/img/coolerseparator.svg" class="d-none" alt="">


<style>
    .addiction {
        position: absolute;
        top: 7vh;
        left: 50%;
        text-align: center;
        transform: translateX(-50%);
        pointer-events: none;
    }

    :global {
        body {
            background-image: url("/img/fancy.svg");
            background-size: 100% auto;
            background-repeat: no-repeat;
            font-family: 'Montserrat', sans-serif;
        }

        .home-main > section {
            width: 100%;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;

        & .h1-seg {
            width: 100%;
            margin-top: 7.125rem;

            @media (max-width: 769px) {
                margin-top: 8rem;
            }

            & h1 {
                font-size: 8.25rem;
                /*this originally was Onest but apparently figma just uses */
                /*the wrong font for Onest and that is not Onest???*/
                /*Could not find what the actual font in there was. Enshittified software...*/
                /*This one looks better tho so whatever*/
                font-family: 'Rozanova', sans-serif;
                font-weight: bold;
                text-align: center;
                line-height: 1em;

                /*forcing 2 lines*/
                min-height: 2em;

                max-width: 60vw;
                user-select: none;

                & span:not(.wowie) {
                    font-family: 'Rozanova', sans-serif;
                    font-weight: bold;
                    color: #151515;
                }

                @media (max-width: 769px) {
                    font-size: 4rem;
                    width: 100vw;
                    max-width: 100vw;
                    box-sizing: border-box;
                    padding-left: 2rem;

                    min-height: 4em;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;


                    & span {
                        position: relative;

                        display: block;
                    }

                    /* you could do that?!!??! */
                    & br {
                        display: none;
                    }

                    :nth-last-child(5):after {
                        content: ",";
                    }

                    :nth-last-child(4) {
                        display: none;
                    }
                }

                & .wowie {
                    color: var(--header-highlight-color);
                    font-family: 'Rozanova', sans-serif;
                    -webkit-text-stroke: 1px black;
                    cursor: pointer;

                    @media (max-width: 769px) {
                        -webkit-text-stroke: 2px black;
                    }
                }
            }
        }

        /* + tag seg, a component */

        & .content-seg {
            width: 100%;
            margin-top: calc(3vh + 1rem);
            display: flex;
            flex-direction: row;
            align-items: flex-start;
        }
    }
</style>