/**
 * Created by Saj Arora on 10/9/2016.
 */
(function(){
    angular.module('app').controller('CaseEditCtrl', CaseEditCtrl);

    function CaseEditCtrl($log, $mdDialog, $mdToast, caseService, Color, data, electron){
        var vm = this;

        vm.cancel = Cancel;
        vm.colorPicker = Color.defaultColorPicker;
        vm.data = {
            case_id: 1,
            name: 'Saj Arora',
            path: "C:\\Users\\Saj Arora\\Documents\\GitHub\\depix\\casee",
            open_date: new Date(),
            description: 'hello world'
        };
        vm.data.start_date = vm.data.start_date ? new Date(vm.data.start_date) : new Date();
        vm.data.end_date = vm.data.end_date ? new Date(vm.data.end_date) : null;
        vm.data.color = vm.data.color || Color.getRandomColor();
        vm.openFileDialog = OpenFileDialog;
        vm.submit = Submit;
        Activate();

        ///functions
        function Activate(){
        }

        function Cancel(){
            vm.data = {};
            $mdDialog.cancel();
        }

        function OnSuccess(data){
            $log.debug('Term created...', data);
            vm.data = {};
            $mdDialog.hide(data);
        }

        function OnError(error){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(error.data && error.data.description ? error.data.description : 'Error saving Case.')
                    .position('bottom')
                    .hideDelay(3000)
                    .parent('#dialog-wrapper')
            );
        }

        function OpenFileDialog(path) {
            electron.dialog.showOpenDialog(null, {
                title: 'Choose Case Folder',
                defaultPath: vm.data.path || null,
                buttonLabel: 'Pick Case Folder',
                properties: ['openDirectory']
            }).then(function (result) {
                if (result.length)
                    vm.data.path = result[0];
            });
        }

        function Submit(){
            var error = false;
            vm.errors = {};

            if (!vm.data.start_date){
                error = true;
                vm.errors.datetime = true;
            }

            if (error) {
                OnError({data:{description:'Please fix highlighted fields to save reminder.'}});
                return;
            }

            if (vm.data.key){
                vm.data.save().then(OnSuccess, OnError);
            } else {
                caseService.create(vm.data).then(OnSuccess, OnError);
            }
        }
    }
})();