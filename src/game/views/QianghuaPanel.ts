class QianghuaPanel extends eui.Component implements  eui.UIComponent {
	public tab1:eui.RadioButton;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplete, this );
	}

	protected oncomplete():void{
		this.tab1.selected = true;
	}
	
}