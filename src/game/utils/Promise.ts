module gameutils {
	export class Promise {
		private nexts:((success:()=>void,fail?:()=>void)=>void)[] = [];
		private index:number = 0;
		public call():void{
			this.index = 0;
			this.next();
		}

		public clear():void{
			this.next.length = 0;
			this.index = 0;
		}

		private next():void{
			if(this.index <this.nexts.length){
				this.index++;
				this.nexts[this.index-1](this.success.bind(this),this.fail.bind(this));
			}
		}

		private success():void{
			this.next();
		}

		private fail(err?):void{
			throw err;
		}

		public then(next:(success:()=>void,fail?:()=>void)=>void):Promise
		{
			this.nexts.push(next);
			return this;
		}
	}
}