module gameviews {
	export class DragRoleSlot extends TeamListItem {
        public constructor() {
            super();
        }

        protected onComplete():void{
            super.onComplete();
            this.bg.visible = this.stateTf.visible =  this.selectedIcon.visible = false;
        }

    }
}