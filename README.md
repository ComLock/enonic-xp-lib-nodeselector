# com.enonic.lib.nodeselector

## Usage

	<input name="myName" type="CustomSelector">
		<label>My label</label>
		<occurrences minimum="0" maximum="0"/>
		<config>
			<service>nodeSelector</service>

			<!-- Optional Named params -->
			<!--param value="systemRepo">true</param--><!-- default is false -->
			<!--param value="cmsRepo">true</param--><!-- default is false -->
			<!--param value="cmsRepoBranch">draft</param--><!-- default is master -->
			<!--param value="include">com.enonic.app.myapp.*</param--><!-- regexp -->
			<!--param value="exclude">com.enonic.app.myapp-ignore</param--><!-- regexp -->
			<!--param value="login">su</param--><!-- default is current user -->
			<!--param value="userStore">system</param--><!-- default is current user userstore -->
			<!--param value="principals">role:system.admin</param--><!-- default is current user principals -->

			<!-- Optional ...Rest params value is repoId and content is branch -->
			<!--param value="com.enonic.app.myapp">master</param-->
		</config>
	</input>
