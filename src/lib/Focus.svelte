<script lang="ts">
    import {expoIn} from "svelte/easing";
    import {blur} from "svelte/transition";
    import {timestamptzToHumanDate} from "$lib/utils/timestamptzToHumanDate";

    let {focusedNift, handleUnfocus, descElem = $bindable(), isFocusLeft, focusedNiftTags, focusButtonSeg} = $props();
    const orderedFocusedNiftTags = $derived({
        what: focusedNiftTags.what,
        which: focusedNiftTags.which,
        why: focusedNiftTags.why
    })

    const replaceMdLinks = (input: string): string => {
        return input.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, link) => {
            return `<a href="${link}" class="comment-link">${text}</a>`;
        });
    }
</script>

<div class="focus">
    <div transition:blur={{duration: 200, easing: expoIn}} class="lightbox"></div>
    <button onclick={handleUnfocus} aria-label="close-modal" class="x-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
        </svg>
    </button>
    <div bind:this={descElem} transition:blur={{duration: 400}}
         class={`desc ${isFocusLeft ? 'desc-left' : 'desc-right'}`}>
        <h2>{focusedNift.display_name}</h2>
        <p class="desc-comment">{@html replaceMdLinks(focusedNift.comment)}</p>
        <div class="desc-custom">{@html focusedNift.custom}</div>

        <div class="desc-separator">
            <img src="/img/coolerseparator.svg" alt="separator">
        </div>
        <div class="desc-tags">
            {#each Object.entries(orderedFocusedNiftTags) as [key, values] (key)}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-copyright-icon lucide-copyright">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M14.83 14.83a4 4 0 1 1 0-5.66"/>
                </svg>
                <p>{focusedNift.copyright}</p>
            </div>
        {/if}

        <p class="desc-small-gray">Added on: {timestamptzToHumanDate(focusedNift.created_at)}</p>
    </div>
    <a transition:blur={{duration: 200, easing: expoIn}} href={focusedNift.link} target="_blank" rel="noopener"
       class={`visit visit-${focusButtonSeg}`}>
        Visit
    </a>
</div>

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

        @media (max-width: 1024px) {
            padding: 0 1.5rem;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .desc-right {
        left: 53%;
        transform: translateY(-50%);
        padding: 0 4rem 0 0;

        @media (max-width: 1024px) {
            padding: 0 1.5rem;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .desc {
        position: fixed;
        top: 50%;
        z-index: 1001;
        width: 45%;
        max-width: 70vw;
        box-sizing: border-box;
        color: white;

        display: flex;
        flex-direction: column;
        max-height: 100dvh;
        overflow-y: auto;

        @media (max-width: 1024px) {
            top: 0;
            width: 100vw;
            padding: 2rem 1.5rem 10rem 1.5rem;
            max-width: 100vw;
            height: 100%;
            max-height: 100dvh;
        }

        & h2 {
            font-size: 1.7rem;

            @media (max-width: 1023px) {
                order: 1;
            }
        }

        & .desc-metadesc {
            padding-top: 1rem;
            color: #ffffff;
            font-style: italic;

            font-size: 1rem;
            line-height: 1.5em;
            margin-top: 1rem;

            @media (max-width: 1024px) {
                margin-top: 0;
                order: 4;
            }
        }

        & .desc-tags {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.4rem;
            padding: 1.2rem 0 0 0;

            @media (max-width: 1024px) {
                order: 6;
            }

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

        & .desc-separator {
            @media (max-width: 1024px) {
                order: 3;
            }

            & img {
                margin-top: 1rem;
                width: 100%;
                pointer-events: none;
                user-select: none;
            }
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

            @media (max-width: 1024px) {
                margin: 1.5rem 0 1rem 0;
                padding: 0.7rem 1.2rem;
                order: 5;
            }

            & svg {
                width: 1.5rem;
                height: auto;

                @media (max-width: 1024px) {
                    width: 3rem;
                }
            }

            & p {
                padding-left: 0.4rem;
                user-select: none;

                @media (max-width: 1024px) {
                    padding-left: 1rem;
                }
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

            @media (max-width: 1024px) {
                order: 2;
            }
        }

        & .desc-custom {
            @media (max-width: 1024px) {
                order: 2;
            }
        }

        & .desc-small-gray {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: #cccccc;

            @media (max-width: 1024px) {
                margin-top: 2rem;
                order: 7;
            }
        }
    }

    /* even if this was kind of annoying to make the math on this is pretty beautiful if i'd have to say so */
    .visit-1 {
        left: 37.5%;
        transform: translate(-37.5%, -50%);
        margin-left: -1rem;

        @media (max-width: 1024px) {
            margin-left: 0;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .visit-2 {
        left: 12.5%;
        transform: translate(-12.5%, -50%);
        margin-left: -3rem;

        @media (max-width: 1024px) {
            margin-left: 0;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .visit-3 {
        left: 87.5%;
        transform: translate(-87.5%, -50%);
        margin-left: 3rem;

        @media (max-width: 1024px) {
            margin-left: 0;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .visit-4 {
        left: 62.5%;
        transform: translate(-62.5%, -50%);
        margin-left: 1rem;

        @media (max-width: 1024px) {
            margin-left: 0;
            left: 50%;
            transform: translate(-50%, -50%);
        }
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

        @media (max-width: 1024px) {
            left: 50%;
            top: 80%;
            transform: translateX(-50%);

            &:hover {
                top: 81%;
            }
        }

        &:hover {
            outline: 1px solid #151515;
            top: 51%;
            box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 25%), 0 3px 0 1px rgba(0, 0, 0, 15%);
        }
    }
</style>