function GridContent(grid, classes, delayRun) {
    if(!grid) { 
        console.error('No GRID Object provided.');
        return;
    }
    
    this.grid = grid;
    if(!classes) var classes = {};
    this.classes = {
        mouseover: classes.mouseover || 'grid-hover',
        mouseout: classes.mouseout || ''
    };
    
    var missing = 'rows|columns|items|container';
    
    for(item in this.grid) {
        switch(item.toString()) {
            case 'rows': {
                missing = missing.replace(item.toString(), ''); 
                continue;
            }
            case 'columns': {
                missing = missing.replace(item.toString(), ''); 
                continue;
            }
            case 'items': {
                missing = missing.replace(item.toString(), ''); 
                continue;
            }
            case 'container': {
                missing = missing.replace(item.toString(), ''); 
                continue;
            }
            default: break;
        }
    }

    if(missing.replace(/\|/g, '').length > 0) {
        console.error('GRID object must container {rows, columns, items}. Missing: ' + missing);
        return;
    }
    
    if(delayRun) 
        return this;
        
    this.Initialize();
    return this;
};

GridContent.prototype.Initialize = function() {
  this.getItems();
  this.initPositioning();
  
  var _this = this;
  
  this.items.on({
     mouseover: function(evt) {
         _this.mouseOver($(evt.target));
     },
     mouseout: function(evt) {
         _this.mouseOut($(evt.target));
     },
     mousedown: function(evt) {
         if($(evt.target).data('expanded') === true)
            _this.collapse($(evt.target));
         else 
            _this.expand($(evt.target));
     }
  });
};

GridContent.prototype.getItems = function() {
    this.container = this.grid.container;
    this.items = this.grid.items;
    this.rows = this.grid.rows;
    this.columns = this.grid.colums;
};

GridContent.prototype.initPositioning = function() {
    var _this = this;
    
    this.container.width(this.container.outerWidth()).height(this.container.outerHeight()).css('overflow', 'visible');
    
    this.items.each(function() {
        var _self = $(this);
        var left = _self.offset().left - _this.container.offset().left;
        var top = _self.offset().top - _this.container.offset().top;
        
        _self.css({
            'left': left,
            'top': top
        }).data({
            'top': top,
            'left': left,
            'width': _self.width(),
            'height': _self.height()
        });
    });
    this.items.css('position', 'absolute');
};

GridContent.prototype.mouseOver = function(item) {
    item
        .removeClass(this.classes.mouseout)
        .addClass(this.classes.mouseover);
};

GridContent.prototype.mouseOut = function(item) {
    item
        .removeClass(this.classes.mouseover)
        .addClass(this.classes.mouseout);
};

GridContent.prototype.expand = function(item) {
    var _this = this;
    
    item.addClass(this.classes.mouseover).animate({
        top: 0,
        left: 0,
        width: _this.container.width(),
        height: _this.container.height()
    }, function() {
        item.data('expanded', true);
    });
};

GridContent.prototype.collapse = function(item) {
    var _this = this;
    
    item.animate({
        top: item.data('top'),
        left: item.data('left'),
        width: item.data('width'),
        height: item.data('height')
    }, function() {
        item.data('expanded', false);
        item.removeClass(_this.classes.mouseover)
    });
};