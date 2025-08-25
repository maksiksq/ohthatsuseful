<script>
    const {nift, focusedNift, handleFocus} = $props();
</script>

<div role="button" tabindex="0"
     class={`card ${(focusedNift?.title === nift.title) ? 'focused' : ''}`}
     onclick={(e) => {handleFocus(e, nift)}} onkeydown={(e) => {handleFocus(e, nift)}}>
    <div class="h2-wrap">
        <h2 title={nift.display_name}>{nift.display_name}</h2>
    </div>
    <div class="card-info">
        <p class="card-info-favicon-wrap">
            <img class="card-info-favicon" loading="lazy" src={nift.favicon}
                 alt={`${nift.display_name} favicon`}>
        </p>
        <div class="card-info-title-wrap">
            <p class="card-info-title">{nift.title}</p>
        </div>
        <a class="card-info-link" href={nift.link} target="_blank" rel="noopener">🔗</a>
    </div>
    <p class="card-screenshot-link-wrap">
        <img class="card-screenshot" loading="lazy" src={nift.screenshot_smol} width="500" height="281"
             alt={nift.name}>
    </p>
</div>

<style>
    .focused {
        position: relative;
        z-index: 1002;

        /* notice that it's not a border because layout shift */
        outline: 1px solid #151515 !important;

        @media (max-width: 1024px) {
            position: initial;
            z-index: 1;
        }
    }

    .card {
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
</style>