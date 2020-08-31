import { NotesTreeDataSource } from './navigation-datasource';
import { NotesNode } from '../../utils/model';

fdescribe('NotesTreeDataSource', () => {
    let data_source:NotesTreeDataSource;
    let TREE_DATA:NotesNode[] = [
        {
          name: 'Fruit',
          level: 1,
          children: [
            {name: 'Apple', level: 2},
            {name: 'Banana', level: 2},
            {name: 'Fruit loops', level: 2},
          ]
        }, {
          name: 'Vegetables',
          level: 1,
          children: [
            {
              name: 'Green', level: 2, 
              children: [
                {name: 'Broccoli', level: 3},
                {name: 'Brussels sprouts', level: 3},
              ]
            }, {
              name: 'Orange', level: 2, 
              
              children: [
                {name: 'Pumpkins', level: 3},
                {name: 'Carrots', level: 3},
              ]
            },
          ]
        },
      ];
    beforeEach( () => {
        data_source = new NotesTreeDataSource();
        data_source._data.children = Object.assign([],TREE_DATA);     
    });

    afterEach( () => {
        data_source = new NotesTreeDataSource();
        data_source._data.children = Object.assign([],[]);
        data_source = null;     
    });
  
  xit('should find all nodes in level', () => {
    
    expect(data_source.getNodes4Level(1,data_source._data).length ).toBe(2);
    expect(data_source.getNodes4Level(2,data_source._data).length ).toBe(5);
    expect(data_source.getNodes4Level(3,data_source._data).length ).toBe(4);
  });

  xit('should add node at parent_node', () => {
    
    data_source.addNode( 
        {name:'Orange', level:2},
        {name:'test',level:3},
        data_source._data ) ;
    let nodes = data_source.getNodes4Level(3,data_source._data); 
    expect( nodes.length).toBe(5);
    expect( nodes.findIndex(n => n.name == 'test') >=0 ).toBe(true);

    //console.log("Adding level 3: ", JSON.stringify(data_source._data));
    data_source.addNode( 
        {name:'Vegetables', level:1},
        {name:'test',level:2},
        data_source._data ) ;
    
    nodes = data_source.getNodes4Level(2,data_source._data); 
    expect( nodes.length).toBe(6);
    expect( nodes.findIndex(n => n.name == 'test') >=0 ).toBe(true);

  });

  it('should remove node at parent_node', () => {
    let nodes = data_source.getNodes4Level(3,data_source._data);
    console.log("nodes at level 3", nodes) 
    
    data_source.removeNode( 
        {name:'Green', level:2},
        {name:'Brussels sprouts',level:3},
        data_source._data ) ;

    nodes = data_source.getNodes4Level(3,data_source._data);
    console.log("nodes at level 3", nodes) 
    expect( nodes.length).toBe(3);
    expect( nodes.findIndex(n => n.name == 'Brussels sprouts') < 0 ).toBe(true);

    });

    xit('should replace node at parent_node', () => {
        let nodes = data_source.getNodes4Level(3,data_source._data);
        console.log("nodes at level 3", nodes) 
        
        data_source.replaceNode( 
            {name:'Green', level:2},
            { name:'Brussels sprouts', level:3},
            {name:'pepper',level:3},
            data_source._data,
            'replace' ) ;
    
        nodes = data_source.getNodes4Level(3,data_source._data);
        console.log("nodes at level 3", nodes) 
        expect( nodes.length).toBe(4);
        expect( nodes.findIndex(n => n.name == 'Brussels sprouts') < 0 ).toBe(true);
        expect( nodes.findIndex(n => n.name == 'pepper') >= 0 ).toBe(true);
    
        });
});
