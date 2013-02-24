function GridContent(grid) {
    if(!grid) { 
        console.error('No GRID Object provided.');
        return;
    }
    
    this.grid = grid;
    
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
    
    this.items.each(function(i) {
        var _self = $(this);
        var left = _self.offset().left - _this.container.offset().left;
        var top = _self.offset().top - _this.container.offset().left;
        
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
    item.css({
       'box-shadow': '0px 0px 10px rgba(0, 0, 0, .6)',
       'z-index': 100
    });
};

GridContent.prototype.mouseOut = function(item) {
    item.css({
       'box-shadow': '0px 0px 2px rgba(0, 0, 0, .6)',
       'z-index': 5
    });
};

GridContent.prototype.expand = function(item) {
    var _this = this;
    
    item.animate({
        'z-index': 100,
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
        'z-index': 5,
        top: item.data('top'),
        left: item.data('left'),
        width: item.data('width'),
        height: item.data('height')
    }, function() {
        item.data('expanded', false);
    });
};