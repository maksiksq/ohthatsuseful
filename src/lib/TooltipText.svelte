<script lang="ts">
    // FUTURE USE WARNING:
    // Will go offscreen if close to the edge

    const {text} = $props();
    let copy = $state('Click to copy');
    let hovering = $state(false);

    const handleTooltip = () => {
        hovering = true;
        copy = 'Click to copy';
    }

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied!');
            copy = 'Copied!';
        } catch (err) {
            console.error('Clipboard write failed:', err);
            copy = 'Failed to copy. Please do it manually then :)';
        }
    }

    const handleCopyKeyboard = async (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            await navigator.clipboard.writeText(text);

            copy = 'Copied!';
        }
    }

    const handleCopyOut = () => {
        copy = 'Click to copy';
        hovering = false;
    }

    let tooltip: HTMLElement | undefined = $state();

    const handleCopyMove = (e: MouseEvent) => {
        if (!tooltip) return;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY - 20}px`;
    }
</script>
<span class="tooltip-text" aria-label={`click to copy ${text}`} onmouseenter={handleTooltip} onpointermove={handleCopyMove} onclick={handleCopyClick}
     onkeydown={handleCopyKeyboard} onmouseleave={handleCopyOut}
     onblur={handleCopyOut} tabindex="0" role="button" >
    {#if hovering}
        <div class="tooltip" bind:this={tooltip} role="status" aria-live="polite">
            {copy}
        </div>
    {/if}
    {text}
</span>

<style>
    .tooltip-text {
        font-weight: bold;
        cursor: pointer;
        color: #190025;
        line-height: 1.5rem;

        & .tooltip {
            position: absolute;
            pointer-events: none;
            transition: none;
            background: var(--header-highlight-color);
            color: #151515;
            padding: 0 0.4rem;
            border-radius: 1px;
            font-family: monospace;
            border: 1px solid black;
            box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }
    }
</style>