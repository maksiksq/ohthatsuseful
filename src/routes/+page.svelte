<script lang="ts">
    import TagSeg from "./TagSeg.svelte";
    import confetti from "canvas-confetti";
    import {enhance} from "$app/forms";
    import {onMount} from "svelte";
    import {blur} from 'svelte/transition';
    import {expoIn} from "svelte/easing";
    import {timestamptzToHumanDate} from "$lib/utils/timestamptzToHumanDate";
    import Footer from "$lib/Footer.svelte";
    import VirtualizedNifties from "$lib/VirtualizedNifties.svelte";
    import Fuse from "fuse.js";

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
        console.log(item.tags);
        console.log(selectedTags);
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
                document.documentElement.classList.remove('scroll-lock');
            }, 400);
        }
    }
</script>


<svelte:window onclick={focus ? (e) => {handleUnfocus(e)} : () => {}} onkeydown={summonDevOverlay}/>
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
        <h1>oh <span class="wowie" role="button" tabindex="-1" onclick={() => rotateWowies(true)}
                     onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter') rotateWowies(true)}}>{wowie}</span>,<br>
            that's useful</h1>
    </section>
    <TagSeg tags={data.tags} bind:query={query} bind:selectedTags={selectedTags}/>
    <section class="content-seg">
        <VirtualizedNifties nifties={searchedNifties} {focusedNift} {handleFocus}/>
    </section>
</main>
{#if focus && focusedNift}
    <div class="focus">
        <div transition:blur={{duration: 200, easing: expoIn}} class="lightbox"></div>
        <button onclick={handleUnfocus} aria-label="close-modal" class="x-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
        </button>
        <div bind:this={descElem} transition:blur={{duration: 400}}
             class={`desc ${isFocusLeft ? 'desc-left' : 'desc-right'}`}>
            <h2>{focusedNift.display_name}</h2>
            <p class="desc-comment">{focusedNift.comment}</p>
            <div class="desc-custom">{@html focusedNift.custom}</div>

            <div class="desc-separator">
                <img src="/img/coolerseparator.svg"  alt="separator">
            </div>
            <div class="desc-tags">
                {#each Object.entries(focusedNiftTags) as [key, values] (key)}
                    <p class="desc-tag-cat">{key}</p>
                    <ul>
                        {#each values as tag (tag)}
                            <li>
                                <p class="desc-tag">#{tag}</p>
                            </li>
                        {/each}
                    </ul>
                {/each}
            </div>
            <p class="desc-metadesc">{focusedNift.metadesc === "No description provided by the site." ? focusedNift.metadesc : `"${focusedNift.metadesc}"`}</p>
            {#if focusedNift.warning}
                <div class="desc-disclaimer desc-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        <path fill="#151515"
                              d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.9 536.6 69.6 524.5C62.3 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 232C306.7 232 296 242.7 296 256L296 368C296 381.3 306.7 392 320 392C333.3 392 344 381.3 344 368L344 256C344 242.7 333.3 232 320 232zM346.7 448C347.3 438.1 342.4 428.7 333.9 423.5C325.4 418.4 314.7 418.4 306.2 423.5C297.7 428.7 292.8 438.1 293.4 448C292.8 457.9 297.7 467.3 306.2 472.5C314.7 477.6 325.4 477.6 333.9 472.5C342.4 467.3 347.3 457.9 346.7 448z"/>
                    </svg>
                    <p>{focusedNift.warning}</p>
                </div>
            {/if}
            {#if focusedNift.copyright}
                <div class="desc-disclaimer desc-copyright">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copyright-icon lucide-copyright"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>
                <p>{focusedNift.copyright}</p>
                </div>
            {/if}

            <p class="desc-small-gray">Added on: {timestamptzToHumanDate(focusedNift.created_at)}</p>
        </div>
        <a transition:blur={{duration: 200, easing: expoIn}} href={focusedNift.link} target="_blank" rel="noopener" class={`visit visit-${focusButtonSeg}`}>
            Visit
        </a>
    </div>
{/if}
<Footer fromContact={false}/>

<!-- just caching the image here to prevent layout flicker when clicking on a card -->
<img src="/img/coolerseparator.svg" class="d-none" alt="">


<style>
    .x-button {
        z-index: 1002;
        position: fixed;
        top: 1rem;
        right: 1rem;

        & svg {
            fill: white;
            width: 1.5rem;
            height: 1.5rem;
        }
    }

    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(16, 16, 16, 0.7);
        z-index: 1000;
    }

    .desc-left {
        left: 3rem;
        padding: 0 4rem 0 0;
        transform: translate(3rem, -50%);
    }

    .desc-right {
        left: 53%;
        transform: translateY(-50%);
        padding: 0 4rem 0 0;
    }

    .desc {
        position: fixed;
        top: 50%;
        z-index: 1001;
        width: 45%;
        max-width: 70vw;
        box-sizing: border-box;
        color: white;

        & h2 {
            font-size: 1.7rem;
        }

        & .desc-metadesc {
            padding-top: 1rem;
            color: #ffffff;
            font-style: italic;

            font-size: 1rem;
            line-height: 1.5em;
            margin-top: 1rem;
        }

        & .desc-tags {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.4rem;
            padding: 1.2rem 0 0 0;

            & .desc-tag-cat {
                color: #dddddd;
                font-size: 1rem;
            }

            & ul {
                color: #cccccc;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 0.3rem;
                font-size: 1rem;
            }
        }

        & .desc-separator > img {
            margin-top: 1rem;
            width: 100%;
            pointer-events: none;
            user-select: none;
        }

        & .desc-disclaimer {
            display: flex;
            align-items: center;
            background-color: rgb(255, 236, 108);
            border: 2px solid black;

            box-sizing: border-box;
            padding: 0.7rem 1.7rem;
            margin: 1rem 0 1rem 0;
            color: #151515;

            & svg {
                width: 1.5rem;
                height: auto;
            }

            & p {
                padding-left: 0.4rem;
                user-select: none;
            }
        }

        & .desc-warning {
            background-color: rgb(255, 236, 108);
        }

        & .desc-copyright {
            background-color: rgb(250, 250, 246);
        }

        & .desc-comment {
            margin-top: 1rem;
            font-size: 1.1rem;
            line-height: 1.5em;
        }

        & .desc-small-gray {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: #cccccc;
        }
    }

    /* even if this was kind of annoying to make the math on this is pretty beautiful if i'd have to say so */
    .visit-1 {
        left: 37.5%;
        transform: translate(-37.5%, -50%);
        margin-left: -1rem;
    }

    .visit-2 {
        left: 12.5%;
        transform: translate(-12.5%, -50%);
        margin-left: -3rem;
    }

    .visit-3 {
        left: 87.5%;
        transform: translate(-87.5%, -50%);
        margin-left: 3rem;
    }

    .visit-4 {
        left: 62.5%;
        transform: translate(-62.5%, -50%);
        margin-left: 1rem;
    }

    .visit {
        position: fixed;
        top: 50%;
        margin-top: 2rem;
        padding: 0.1rem 3rem;

        display: flex;
        align-items: center;

        background-color: white;
        border-radius: 3px;
        border: 1px solid #151515;
        box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 25%), 0 5px 0 1px rgba(0, 0, 0, 15%);
        z-index: 1001;
        color: #151515;

        font-weight: bold;
        font-size: 2.7rem;
        transition: box-shadow, top 0.2s ease-in-out;

        &:hover {
            outline: 1px solid #151515;
            top: 51%;
            box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 25%), 0 3px 0 1px rgba(0, 0, 0, 15%);
        }
    }

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

                /*force 2 lines*/
                min-height: 2em;

                max-width: 60vw;
                user-select: none;

                & .wowie {
                    color: var(--header-highlight-color);
                    font-family: 'Rozanova', sans-serif;
                    -webkit-text-stroke: 1px black;
                    cursor: pointer;
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