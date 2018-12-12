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

			<!--param value="filtersJson">...</param>

			<!-- Optional ...Rest params value is repoId and content is branch -->
			<!--param value="com.enonic.app.myapp">master</param-->
		</config>
	</input>

## Compatibility

| Lib version | XP version |
| ----------- | ---------- |
| 1.[01].0 | 6.14.0 |

## Changelog

### 1.1.0

* Added filtersJson

### 1.0.0

* First release of library that includes the following params:
* systemRepo
* cmsRepo
* cmsRepoBranch
* include
* exclude
* login
* userStore
* principals
* ...rest
