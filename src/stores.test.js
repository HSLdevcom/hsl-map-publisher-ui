import commonStore from './stores/commonStore';

describe('commonStore', () => {
    it('Serializes template', () => {
        const template = {
            areas: [{
                slots: [
                    { image: { name: 'icon_subway.svg'}, size: 1}
                ]
            }],
            created_at: '2020-01-20T11:06:03.444Z',
            id: '123',
            label: 'label',
            updated_at: '2020-01-20T11:06:03.444Z',
            test: 'test'
        }

        const jsonString = commonStore.serializeCurrentTemplate(template);
        const json = JSON.parse(jsonString);

        expect(json.areas[0]).toEqual([{"image": "icon_subway.svg", "size": 1}]);
        expect(json.id).toEqual('123');
        expect(json.label).toEqual('label');
        expect(json.created_at).toEqual(undefined);
    });
});