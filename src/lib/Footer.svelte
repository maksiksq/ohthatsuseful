<script>
    import {browser} from "$app/environment";

    const {fromContact = false} = $props();

    const socials = [
        {
            text: 'Github',
            icon: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z',
            link: 'https://github.com/maksiksq/ohthatsuseful',
        },
        {
            text: 'Bluesky',
            icon: 'M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z',
            link: 'https://bsky.app/profile/maksiks.bsky.social',
        },
        {
            text: 'Twitter',
            icon: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
            link: 'https://x.com/maksiksq',
        },
        {
            text: 'Ko-fi',
            icon: 'M538.317 201.703C520.892 109.62 428.787 98.1689 428.787 98.1689H16.2966C2.68144 98.1689 0.990813 116.157 0.990813 116.157C0.990813 116.157 -0.857604 281.252 0.494896 382.645C4.19173 437.286 58.7876 442.876 58.7876 442.876C58.7876 442.876 245.14 442.358 328.521 441.772C383.478 432.169 389.001 383.93 388.437 357.601C486.538 363.011 555.741 293.786 538.317 201.703ZM288.961 280.847C260.874 313.6 198.546 370.472 198.546 370.472C198.546 370.472 195.818 373.155 191.558 370.991C189.845 369.706 189.124 368.962 189.124 368.962C179.138 359.021 113.203 300.232 98.1905 279.832C82.2084 258.08 74.7246 218.97 96.1392 196.203C117.576 173.436 163.877 171.722 194.488 205.377C194.488 205.377 229.766 165.208 272.663 183.669C315.582 202.154 313.959 251.542 288.961 280.847ZM428.11 291.622C407.192 294.236 390.195 292.253 390.195 292.253V164.193H430.094C430.094 164.193 474.524 176.614 474.524 223.658C474.524 266.781 452.32 283.777 428.11 291.622Z',
            link: 'https://ko-fi.com/maksiks',
        }
    ]

    //

    let footerBgX = $state(0);
    const updateFooterBg = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        const t = currentScroll / maxScroll;

        const raw = -(currentScroll + window.innerHeight) / 28;

        footerBgX = raw * (1 - t);
    }

    $inspect(footerBgX)
</script>

<svelte:window onscroll={updateFooterBg} />

<footer>
    <div class="crank-seg">
        {#if fromContact}
            <p class="crank-found">Contacted</p>
            <p class="lmao">(lmao)</p>
        {/if}
        {#if !fromContact}
            <p class="crank-found">Discovered</p>
        {/if}
        <p class="crank-anything">Something?</p>
    </div>
    <div class="luv-seg">
        <p>Made by Maksiks with ❤️ & ☕<br> Hope you bookmarked a thing or two!</p>
        <a class="sauce" href="https://github.com/maksiksq/ohthatsuseful">This site is open source!
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
            </svg>
        </a>
    </div>
    <div class="footerBg">
        <img style={`right: ${footerBgX}px;`} src="/img/footerbg.svg" role="presentation" alt="footer background">
    </div>
    <div class="text-seg">
        <!--        <a class="contact" href="/contact">Contact</a>-->
        <div class="socials">
            <ul>
                {#each socials as social (social.text)}
                    <li class={`social so-${social.text.toLowerCase()} ${fromContact ? 'inline' : ''}`}>
                        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        <a href={social.link} target="_blank" rel={`noopener ${fromContact ? "me" : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="{social.text === 'Ko-fi' ? 'ko-fi' : ''}"
                                 viewBox="0 0 512 512">
                                <path d={social.icon}/>
                            </svg>
                            {social.text}
                        </a>
                    </li>
                {/each}
                <li class="social social-contact">
                    <a href={fromContact ? '/' : '/contact'} class="social-contact-link">
                        {#if fromContact}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path d="M144 336C144 288.7 109.8 249.4 64.8 241.5C72 177.6 126.2 128 192 128L448 128C513.8 128 568 177.6 575.2 241.5C530.2 249.5 496 288.7 496 336L496 368L144 368L144 336zM0 448L0 336C0 309.5 21.5 288 48 288C74.5 288 96 309.5 96 336L96 416L544 416L544 336C544 309.5 565.5 288 592 288C618.5 288 640 309.5 640 336L640 448C640 483.3 611.3 512 576 512L64 512C28.7 512 0 483.3 0 448z"/>
                            </svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z"/>
                            </svg>
                        {/if}
                        {fromContact ? 'Home' : 'Contact'}
                    </a>
                </li>
            </ul>
        </div>
    </div>

</footer>

<style>
    footer {
        margin-top: 22dvh;
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;

        & .crank-seg {
            display: flex;
            flex-direction: column;
            width: 30%;

            padding-top: 3rem;
            border-right: 3px solid #151515;
            /*bottom margin/padding is important here because it mathes it with the full line height for some reason*/
            /*and that makes the page have 2 scrollbars*/
            padding-bottom: 2.6rem;

            position: relative;

            & p {
                font-size: 4.25vw;
                font-family: 'Rozanova', sans-serif;
                font-weight: bold;
                line-height: 1;
                /*forcing 2 lines*/
                max-height: 1lh;

                user-select: none;
            }

            & .lmao {
                position: absolute;
                font-size: 0.5rem;
                margin-left: 3rem;
                font-weight: normal;
                color: #6e6e6e;
                bottom: 1.1rem;
            }

            & .crank-found {
                margin-left: 0.3rem;
            }

            & .crank-anything {
                width: 100%;
                color: var(--header-highlight-color);
                font-family: 'Rozanova', sans-serif;
                -webkit-text-stroke: 1px black;


                margin-left: 0.6rem;
                padding-bottom: 0.4rem;
            }
        }

        & .luv-seg {
            width: 40%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 1.1rem;

            margin-top: -3rem;

            & p, .sauce {
                &:hover {
                    color: #151515;

                    transition: all 0.1s;
                    transform: scale(1.003);
                }
            }

            & .sauce {
                display: flex;
                align-items: center;

                & svg {
                    width: 1.2rem;
                    height: 1.2rem;
                    padding-left: 0.5rem;
                    fill: currentColor;
                }
            }

        }

        & .footerBg {
            & img {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 30vw;

                transition: right 0.6s linear(0, 0.012 0.9%, 0.05 2%, 0.411 9.2%, 0.517 11.8%, 0.611 14.6%, 0.694 17.7%, 0.765 21.1%, 0.824 24.8%, 0.872 28.9%, 0.91 33.4%, 0.939 38.4%, 0.977 50.9%, 0.994 68.4%, 1);
            }
        }

        & .text-seg {
            display: flex;
            justify-content: flex-end;
            align-self: flex-end;
            padding-bottom: 0;
            width: 30%;
            font-size: 1.2rem;

            & .contact {
                margin-top: 1rem;
                margin-right: 4rem;
                position: relative;
                top: -5rem;
            }

            & .socials {
                margin-right: 6vw;

                border-right: 1px solid #151515;
                border-left: 1px solid #151515;
                padding: 2rem 2rem 0 2rem;

                border-bottom: 2px solid #151515;
                border-top: 1px solid #151515;

                /* From https://css.glass */
                background: rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }

            & .social {
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;

                & a {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    & svg {
                        width: 1.2rem;
                        height: 1.2rem;
                        padding-right: 0.5rem;
                        fill: currentColor;
                    }

                    & .ko-fi {
                        padding-right: 0.3rem;
                        width: 1.4rem;
                    }
                }
            }

            & .social, .link {
                font-size: 1.2rem;
                padding-bottom: 0.6rem;
                color: #404040;

                & a {
                    cursor: pointer;
                }

                &:hover {
                    color: #151515;

                    transition: all 0.1s;
                    transform: scale(1.003);
                }
            }

            & .socials {
                & ul {
                    & li:first-child {
                        margin-top: auto;
                    }

                    & li:nth-last-child(2) {
                        padding-bottom: 3rem;
                    }

                    & .social-contact {
                        margin-bottom: 1rem;
                        border-bottom: 1px solid #151515;
                    }
                }
            }

            & .heading {
                font-size: 1.7rem;
                padding-bottom: 0.9rem;
                color: #000000;
            }
        }

    }
</style>