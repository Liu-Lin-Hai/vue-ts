import Vue, { VNode } from 'vue'
/**
 * 告诉 TypeScript window是个全局对象，直接可用，这样就不会在window.xx = 123时报错
 */
declare global {
  	namespace JSX {
	    // tslint:disable no-empty-interface
	    interface Element extends VNode {}
	    // tslint:disable no-empty-interface
	    interface ElementClass extends Vue {}
	    interface IntrinsicElements {
	      [elem: string]: any
	    }
    }
}