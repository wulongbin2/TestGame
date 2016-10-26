//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    private textField:egret.TextField;
    private icons:IconAnima[] = [];
    private iconNum:number = 5;
    private time:number = 0;
    private createView():void {
        this.textField = new egret.TextField();
        this.textField.textAlign = "left";
        this.addChild(this.textField);
        for(var i:number = 0;i <this.iconNum;i++)
        {
            var icon:IconAnima = new IconAnima('blood_diamond_header_png',0);
            this.addChild(icon);
            this.icons.push(icon);
        }

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage, this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage, this)
    }

    private onAddToStage():void{
        this.time = 0;
        this.addEventListener(egret.Event.ENTER_FRAME,this.render, this)
        this.render();
    }

    private onRemoveFromStage():void{
        this.removeEventListener(egret.Event.ENTER_FRAME,this.render,this);
    }

    private render():void{
        this.time++;
        var halfX:number = this.stage.stageWidth>>1;
        var halfY:number = this.stage.stageHeight>>1;
         for(var i:number = 0;i<this.iconNum;i++)
        {
             this.icons[i].x = halfX ;
            this.icons[i].y = halfY ;
            this.icons[i].time = this.time-i*5;
        }
    }

    public setProgress(current:number, total:number):void {
        var per:string = (current/total*100).toFixed(2);
        this.textField.text = per+'%';
        this.textField.x = this.stage.stageWidth - this.textField.textWidth>>1;
        this.textField.y = this.stage.stageHeight - this.textField.textHeight>>1;
    }
}

class IconAnima extends egret.Sprite
{
    private iconImage:eui.Image;
    private iconContainer:egret.Sprite;
    private _time:number;
    
    public constructor(icon:string,time:number){
        super();
        this.iconContainer = new egret.Sprite(); 
        this.addChild(this.iconContainer);
        this.iconImage = new eui.Image(RES.getRes(icon));
        this.iconImage.x = -16;
        this.iconImage.y = -16;
        this.iconContainer.addChild(this.iconImage);
        this.time = time;
    }

    public set time(value:number){
        this._time = value;
        this.render();
    }

    public get time():number
    {
        return this._time;
    }

    private render():void{

        var tempTime:number = this.time;
        const r=100;
        const zhouqi:number = 60*1;
        if(this._time<0)
        {
            this.visible = false;
            return;
        }
        else{
            this.visible = true;
        }

        tempTime = (tempTime/2)%zhouqi;
        tempTime = zhouqi*Math.sin(tempTime/zhouqi*Math.PI/2);


        var radius:number = tempTime/zhouqi*2*Math.PI;
        if(radius<Math.PI)
        {
            this.iconContainer.alpha = Math.min(1,radius/Math.PI*6);
        }
        else{
            this.iconContainer.alpha = Math.min(1,(Math.PI*2-radius)/Math.PI*6);
        }
        radius+=Math.PI/2;
        this.iconImage.x = r*Math.cos(radius);
        this.iconImage.y = r*Math.sin(radius);
        this.iconImage.rotation = tempTime/zhouqi*360;
    }
}
