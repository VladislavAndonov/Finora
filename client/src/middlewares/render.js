import { render } from 'https://esm.run/lit-html@1';
import { appLayout } from '../views/common/appLayout.js';

const root = document.querySelector(".app");

export function withAppShell(ctx, next) {
    ctx.render = (content) => {
        render(appLayout(content, ctx), root);
    }
    next();
}

export function withoutShell(ctx, next) {
    ctx.render = (content) => {
        render(content, root)
    }
    next()
}